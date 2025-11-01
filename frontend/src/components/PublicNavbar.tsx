import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Modern pink-themed navbar with Bootstrap 5.
 * Shows different links based on authentication state.
 * Mobile responsive with collapsible menu.
 */
const PublicNavbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-danger-subtle shadow-sm border-bottom py-3">
      <div className="container">
        <NavLink
          to={isAuthenticated ? '/dashboard' : '/landing'}
          className="navbar-brand fw-bold"
          style={{ color: '#e91e63' }}
        >
          MathWithMarcy
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isAuthenticated ? (
              <>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive ? 'bg-danger text-white' : 'text-danger'
                      }`
                    }
                    style={{ fontWeight: 500, transition: 'all 0.3s' }}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/questions"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive ? 'bg-danger text-white' : 'text-danger'
                      }`
                    }
                    style={{ fontWeight: 500, transition: 'all 0.3s' }}
                  >
                    Practice
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive ? 'bg-danger text-white' : 'text-danger'
                      }`
                    }
                    style={{ fontWeight: 500, transition: 'all 0.3s' }}
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger rounded-pill px-3 py-2"
                    style={{ fontWeight: 500 }}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/landing"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive ? 'bg-danger text-white' : 'text-danger'
                      }`
                    }
                    style={{ fontWeight: 500, transition: 'all 0.3s' }}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive ? 'bg-danger text-white' : 'text-danger'
                      }`
                    }
                    style={{ fontWeight: 500, transition: 'all 0.3s' }}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive ? 'bg-danger text-white' : 'text-danger'
                      }`
                    }
                    style={{ fontWeight: 500, transition: 'all 0.3s' }}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
