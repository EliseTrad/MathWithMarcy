import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();

  const isSubmitDisabled = useMemo(
    () =>
      isSubmitting ||
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim(),
    [confirmPassword, email, isSubmitting, name, password]
  );

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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        autoLogin: true,
        remember: true,
      });

      if (!result.success) {
        const message = result.message ?? 'Unable to create your account.';
        setFormError(message);

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
          setPassword('');
          setConfirmPassword('');
        }

        if (Object.keys(newErrors).length > 0) {
          setFieldErrors(newErrors);
        }

        return;
      }

      onSuccess({ email: email.trim().toLowerCase() });
    } catch (error) {
      console.error('Unexpected registration error', error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {formError && (
        <div className="alert alert-danger rounded-4" role="alert">
          {formError}
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
            onChange={(event) => setName(event.target.value)}
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
            onChange={(event) => setEmail(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
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
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <div className="form-text text-danger">
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-danger btn-lg w-100 rounded-pill py-2"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? 'Registering…' : 'Register'}
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
