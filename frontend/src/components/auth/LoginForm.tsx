import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const isSubmitDisabled = useMemo(
    () => isSubmitting || !email.trim() || !password.trim(),
    [email, isSubmitting, password]
  );

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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('[LOGIN FORM] Form submitted');

    if (!validateForm()) {
      console.log('[LOGIN FORM] Validation failed');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    const trimmedEmail = email.trim().toLowerCase();
    console.log('[LOGIN FORM] Attempting login for:', trimmedEmail);

    try {
      const result = await login({
        email: trimmedEmail,
        password,
      });

      console.log('[LOGIN FORM] Login result:', result);

      if (!result.success) {
        console.log('[LOGIN FORM] Login failed:', result.message);
        setFormError(result.message ?? 'Invalid email or password.');
        return;
      }

      console.log('[LOGIN FORM] Login successful, calling onSuccess');
      onSuccess();
    } catch (error) {
      console.error('[LOGIN FORM] Unexpected login error', error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
      <div className="mb-4 text-center text-md-start">
        <h1 className="h3 fw-bold text-danger mb-2">Welcome back!</h1>
        <p className="text-muted mb-0">
          Sign in to continue mastering math with Marceline.
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
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <div className="form-text text-danger">{fieldErrors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-danger btn-lg w-100 rounded-pill py-2"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
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
