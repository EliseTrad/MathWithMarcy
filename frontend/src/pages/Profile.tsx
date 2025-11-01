import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

type Alert = { type: 'success' | 'danger'; message: string } | null;

/**
 * Profile page shows basic account details for the logged-in user.
 * Redirects to /login if not authenticated.
 */
const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();

  // initialize local state before any early returns to satisfy Hooks rules
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [passwordFlowOpen, setPasswordFlowOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<Alert>(null);
  const [editing, setEditing] = useState<{ name?: boolean; email?: boolean }>(
    {}
  );
  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const saveProfile = async () => {
    setIsSaving(true);
    setAlert(null);
    try {
      const payload: Partial<{ name: string; email: string }> = {};
      if (name.trim() !== user.name) payload.name = name.trim();
      if (email.trim().toLowerCase() !== user.email)
        payload.email = email.trim().toLowerCase();

      if (Object.keys(payload).length === 0) {
        setAlert({ type: 'success', message: 'No changes to save.' });
        setIsSaving(false);
        setEditing({});
        return;
      }

      const res = await api.patch('/users', payload);
      // Update persisted user in storage so AuthContext pick up on refresh
      const nextUser = { ...user, ...res.data.user };
      try {
        localStorage.setItem('mathWithMarcy.user', JSON.stringify(nextUser));
        sessionStorage.setItem('mathWithMarcy.user', JSON.stringify(nextUser));
      } catch {
        // ignore storage errors
      }

      setAlert({ type: 'success', message: 'Profile updated successfully.' });
      setEditing({});
      // reload to refresh AuthContext state
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      // Try to render a friendly message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resp = (err as any)?.response;
      setAlert({
        type: 'danger',
        message: resp?.data?.message ?? 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsSaving(true);
    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword,
      });
      setAlert({ type: 'success', message: 'Password updated successfully.' });
      setPasswordFlowOpen(false);
      return { success: true };
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resp = (err as any)?.response;
      const errorMessage = resp?.data?.message ?? 'Failed to change password.';
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAccount = async () => {
    setIsSaving(true);
    try {
      await api.delete('/users');
      // Ensure sign-out and redirect
      try {
        localStorage.removeItem('mathWithMarcy.user');
        sessionStorage.removeItem('mathWithMarcy.user');
        localStorage.removeItem('mathWithMarcy.token');
        sessionStorage.removeItem('mathWithMarcy.token');
      } catch {
        // ignore
      }
      // call logout from context to clean up
      logout();
    } catch {
      // Error deleting account - user will be redirected regardless
    } finally {
      setIsSaving(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <section className="py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="card shadow-lg rounded-4 border-0">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h1 className="h4 text-danger mb-0">Your Profile</h1>
                  <Link
                    to="/dashboard"
                    className="btn btn-outline-danger btn-sm"
                  >
                    Back to Dashboard
                  </Link>
                </div>

                {alert && (
                  <div
                    className={`alert alert-${
                      alert.type === 'danger' ? 'danger' : 'success'
                    }`}
                    role="alert"
                  >
                    {alert.message}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      value={name}
                      readOnly={!editing.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setEditing((s) => ({ ...s, name: !s.name }))
                      }
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      value={email}
                      readOnly={!editing.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setEditing((s) => ({ ...s, email: !s.email }))
                      }
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      value={'••••••••'}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setPasswordFlowOpen(true)}
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-danger"
                    onClick={saveProfile}
                    disabled={isSaving}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setName(user.name);
                      setEmail(user.email);
                      setEditing({});
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                </div>

                {/* Delete confirmation modal (simple inline modal) */}
                {showDeleteConfirm && (
                  <div
                    className="modal show d-block"
                    tabIndex={-1}
                    role="dialog"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">
                            Confirm account deletion
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowDeleteConfirm(false)}
                          />
                        </div>
                        <div className="modal-body">
                          <p>
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                          </p>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowDeleteConfirm(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              deleteAccount();
                            }}
                            disabled={isSaving}
                          >
                            Yes, delete my account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Change password inline modal flow */}
                {passwordFlowOpen && (
                  <ChangePasswordModal
                    onClose={() => setPasswordFlowOpen(false)}
                    onSave={(current, next) => changePassword(current, next)}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ChangePasswordModal: React.FC<{
  onClose: () => void;
  onSave: (
    current: string,
    next: string
  ) => Promise<{ success: boolean; error?: string }>;
  isSaving?: boolean;
}> = ({ onClose, onSave, isSaving }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!current || !next) {
      setError('Please fill both fields.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    const result = await onSave(current, next);
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Current password</label>
              <input
                type="password"
                className="form-control"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New password</label>
              <input
                type="password"
                className="form-control"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm new password</label>
              <input
                type="password"
                className="form-control"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
