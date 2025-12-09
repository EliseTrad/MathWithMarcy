import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { logout, setUser } from '../store/slices/authSlice';
import {
  setProfileEditing,
  setProfileSaving,
  setShowDeleteConfirm,
  setPasswordFlowOpen,
  setProfileAlert,
  resetProfileForm,
} from '../store/slices/formSlice';
import apolloClient from '../graphql/client';
import {
  UPDATE_USER_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  DELETE_USER_MUTATION,
  type UpdateUserResponse,
  type ChangePasswordResponse,
  type DeleteUserResponse,
} from '../graphql/operations';

/**
 * Profile page shows basic account details for the logged-in user.
 * Redirects to /login if not authenticated.
 */
const Profile: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { editing, isSaving, showDeleteConfirm, passwordFlowOpen, alert } =
    useAppSelector((state) => state.form.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Local state for form fields only
  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const saveProfile = async () => {
    dispatch(setProfileSaving(true));
    dispatch(setProfileAlert(null));
    try {
      const payload: Partial<{ name: string; email: string }> = {};
      if (name.trim() !== user.name) payload.name = name.trim();
      if (email.trim().toLowerCase() !== user.email)
        payload.email = email.trim().toLowerCase();

      if (Object.keys(payload).length === 0) {
        dispatch(
          setProfileAlert({ type: 'success', message: 'No changes to save.' })
        );
        dispatch(setProfileSaving(false));
        dispatch(setProfileEditing({}));
        return;
      }

      const result = await apolloClient.mutate<UpdateUserResponse>({
        mutation: UPDATE_USER_MUTATION,
        variables: payload,
      });

      if (!result.data) {
        throw new Error('Failed to update profile');
      }

      const nextUser = {
        user_id: result.data.updateUser.user_id,
        name: result.data.updateUser.name,
        email: result.data.updateUser.email,
      };

      // Update Redux state
      dispatch(setUser(nextUser));

      dispatch(
        setProfileAlert({
          type: 'success',
          message: 'Profile updated successfully.',
        })
      );
      dispatch(setProfileEditing({}));
    } catch (err) {
      // Try to render a friendly message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.message ?? 'Failed to update profile.';
      dispatch(
        setProfileAlert({
          type: 'error',
          message: errorMessage,
        })
      );
    } finally {
      dispatch(setProfileSaving(false));
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    dispatch(setProfileSaving(true));
    try {
      const result = await apolloClient.mutate<ChangePasswordResponse>({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables: {
          currentPassword,
          newPassword,
        },
      });

      if (!result.data?.changePassword) {
        throw new Error('Failed to change password');
      }

      dispatch(
        setProfileAlert({
          type: 'success',
          message: 'Password updated successfully.',
        })
      );
      dispatch(setPasswordFlowOpen(false));
      return { success: true };
    } catch (err) {
      const errorMessage =
        (err as Error)?.message ?? 'Failed to change password.';
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setProfileSaving(false));
    }
  };

  const deleteAccount = async () => {
    dispatch(setProfileSaving(true));
    try {
      await apolloClient.mutate<DeleteUserResponse>({
        mutation: DELETE_USER_MUTATION,
      });
      // Logout user after account deletion
      dispatch(logout());
      dispatch(resetProfileForm());
    } catch {
      // Error deleting account - user will be redirected regardless
    } finally {
      dispatch(setProfileSaving(false));
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
                      alert.type === 'error' ? 'danger' : alert.type
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
                        dispatch(
                          setProfileEditing({ ...editing, name: !editing.name })
                        )
                      }
                    >
                      🖍
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
                        dispatch(
                          setProfileEditing({
                            ...editing,
                            email: !editing.email,
                          })
                        )
                      }
                    >
                      🖍
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
                      onClick={() => dispatch(setPasswordFlowOpen(true))}
                    >
                      🖍
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
                      dispatch(setProfileEditing({}));
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
                    onClick={() => dispatch(setShowDeleteConfirm(true))}
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
                            onClick={() =>
                              dispatch(setShowDeleteConfirm(false))
                            }
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
                            onClick={() =>
                              dispatch(setShowDeleteConfirm(false))
                            }
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              dispatch(setShowDeleteConfirm(false));
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
                    onClose={() => dispatch(setPasswordFlowOpen(false))}
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
