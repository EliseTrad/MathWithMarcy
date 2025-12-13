/**
 * Modern pink-themed header navbar for protected pages using Bootstrap navbar.
 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-danger-subtle shadow-sm border-bottom">
      <div className="container">
        <NavLink
          to="/dashboard"
          className="navbar-brand fw-bold"
          style={{ color: '#e91e63' }}
        >
          MathWithMarcy
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#protectedNavbar"
          aria-controls="protectedNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="protectedNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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
                to="/ai-assistant"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-pill ${
                    isActive ? 'bg-danger text-white' : 'text-danger'
                  }`
                }
                style={{ fontWeight: 500, transition: 'all 0.3s' }}
              >
                Chat with Marcy
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
