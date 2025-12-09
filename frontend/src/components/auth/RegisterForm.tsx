import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import {
  setRegisterField,
  setRegisterFieldError,
  resetRegisterForm,
} from '../../store/slices/formSlice';

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type RegisterFormProps = {
  onSuccess: (context: { email: string }) => void;
};

/**
 * Registration form card with client-side validation and contextual feedback.
 */
const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const {
    name,
    email,
    password,
    confirmPassword,
    remember,
    fieldErrors,
    registrationCompleted,
  } = useAppSelector((state) => state.form.register);

  const isSubmitDisabled = useMemo(
    () =>
      isLoading ||
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim(),
    [confirmPassword, email, isLoading, name, password]
  );

  useEffect(() => {
    if (isAuthenticated && registrationCompleted) {
      onSuccess({ email: email.trim().toLowerCase() });
    }
  }, [isAuthenticated, registrationCompleted, email, onSuccess]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(resetRegisterForm());
    };
  }, [dispatch]);

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password.trim()) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // Update field errors in Redux
    Object.entries(errors).forEach(([field, error]) => {
      dispatch(setRegisterFieldError({ field, error }));
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear field errors
    dispatch(setRegisterField({ field: 'fieldErrors', value: {} }));
    dispatch(clearAuthError());

    const result = await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        autoLogin: true,
        remember,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      dispatch(
        setRegisterField({ field: 'registrationCompleted', value: true })
      );
    } else if (registerUser.rejected.match(result)) {
      const message = result.payload ?? 'Unable to create your account.';
      const lowered = message.toLowerCase();
      const newErrors: FieldErrors = {};

      if (lowered.includes('name')) {
        newErrors.name = message;
      }
      if (lowered.includes('email')) {
        newErrors.email = message;
      }
      if (lowered.includes('password')) {
        newErrors.password = message;
        dispatch(setRegisterField({ field: 'password', value: '' }));
        dispatch(setRegisterField({ field: 'confirmPassword', value: '' }));
      }

      if (Object.keys(newErrors).length > 0) {
        Object.entries(newErrors).forEach(([field, error]) => {
          dispatch(setRegisterFieldError({ field, error }));
        });
      }
    }
  };

  return (
    <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
      <div className="mb-4 text-center text-md-start">
        <h1 className="h3 fw-bold text-danger mb-2">Create your account</h1>
        <p className="text-muted mb-0">
          Join Marceline&apos;s crew and turn math practice into an adventure.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4" role="alert">
          {error}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="register-name"
            className="form-label fw-semibold text-danger"
          >
            Name
          </label>
          <input
            id="register-name"
            type="text"
            className={`form-control form-control-lg rounded-4 ${
              fieldErrors.name ? 'is-invalid' : ''
            }`}
            value={name}
            onChange={(event) =>
              dispatch(
                setRegisterField({ field: 'name', value: event.target.value })
              )
            }
            placeholder="Marceline Abacus"
            autoComplete="name"
          />
          {fieldErrors.name && (
            <div className="form-text text-danger">{fieldErrors.name}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-email"
            className="form-label fw-semibold text-danger"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            className={`form-control form-control-lg rounded-4 ${
              fieldErrors.email ? 'is-invalid' : ''
            }`}
            value={email}
            onChange={(event) =>
              dispatch(
                setRegisterField({ field: 'email', value: event.target.value })
              )
            }
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldErrors.email && (
            <div className="form-text text-danger">{fieldErrors.email}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-password"
            className="form-label fw-semibold text-danger"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className={`form-control form-control-lg rounded-4 ${
              fieldErrors.password ? 'is-invalid' : ''
            }`}
            value={password}
            onChange={(event) =>
              dispatch(
                setRegisterField({
                  field: 'password',
                  value: event.target.value,
                })
              )
            }
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          {fieldErrors.password && (
            <div className="form-text text-danger">{fieldErrors.password}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-confirm"
            className="form-label fw-semibold text-danger"
          >
            Confirm password
          </label>
          <input
            id="register-confirm"
            type="password"
            className={`form-control form-control-lg rounded-4 ${
              fieldErrors.confirmPassword ? 'is-invalid' : ''
            }`}
            value={confirmPassword}
            onChange={(event) =>
              dispatch(
                setRegisterField({
                  field: 'confirmPassword',
                  value: event.target.value,
                })
              )
            }
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <div className="form-text text-danger">
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>

        <div className="mb-4 form-check">
          <input
            id="remember-me"
            type="checkbox"
            className="form-check-input"
            checked={remember}
            onChange={(event) =>
              dispatch(
                setRegisterField({
                  field: 'remember',
                  value: event.target.checked,
                })
              )
            }
          />
          <label htmlFor="remember-me" className="form-check-label text-muted">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-danger btn-lg w-100 rounded-pill py-2"
          disabled={isSubmitDisabled}
        >
          {isLoading ? 'Registering…' : 'Register'}
        </button>
      </form>

      <p className="mt-4 mb-0 text-center text-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-danger fw-semibold text-decoration-none"
        >
          Log in here
        </Link>
        .
      </p>
    </div>
  );
};

export default RegisterForm;
