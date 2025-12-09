import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import {
  setLoginField,
  setLoginFieldError,
  resetLoginForm,
} from '../../store/slices/formSlice';

type FieldErrors = {
  email?: string;
  password?: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

/**
 * Login form card handling validation, API submission, and user feedback.
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { email, password, remember, fieldErrors } = useAppSelector(
    (state) => state.form.login
  );

  const isSubmitDisabled = useMemo(
    () => isLoading || !email.trim() || !password.trim(),
    [email, isLoading, password]
  );

  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(resetLoginForm());
    };
  }, [dispatch]);

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password.trim()) {
      errors.password = 'Password is required.';
    }

    // Update field errors in Redux
    Object.entries(errors).forEach(([field, error]) => {
      dispatch(setLoginFieldError({ field, error }));
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear field errors
    dispatch(setLoginField({ field: 'fieldErrors', value: {} }));
    dispatch(clearAuthError());

    await dispatch(
      loginUser({
        email: email.trim().toLowerCase(),
        password,
        remember,
      })
    );
  };

  return (
    <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
      <div className="mb-4 text-center text-md-start">
        <h1 className="h3 fw-bold text-danger mb-2">Welcome back!</h1>
        <p className="text-muted mb-0">
          Sign in to continue mastering math with Marceline.
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
            htmlFor="login-email"
            className="form-label fw-semibold text-danger"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className={`form-control form-control-lg rounded-4 ${
              fieldErrors.email ? 'is-invalid' : ''
            }`}
            value={email}
            onChange={(event) =>
              dispatch(
                setLoginField({ field: 'email', value: event.target.value })
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
            htmlFor="login-password"
            className="form-label fw-semibold text-danger"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className={`form-control form-control-lg rounded-4 ${
              fieldErrors.password ? 'is-invalid' : ''
            }`}
            value={password}
            onChange={(event) =>
              dispatch(
                setLoginField({ field: 'password', value: event.target.value })
              )
            }
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <div className="form-text text-danger">{fieldErrors.password}</div>
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
                setLoginField({
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
          {isLoading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className="mt-4 mb-0 text-center text-muted">
        New here?{' '}
        <Link
          to="/register"
          className="text-danger fw-semibold text-decoration-none"
        >
          Create an account
        </Link>
        .
      </p>
    </div>
  );
};

export default LoginForm;
