import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import Header from './Header';
import Footer from './Footer';

/**
 * ProtectedLayout wraps all authenticated pages and provides:
 * - Fixed-top Header and Footer
 * - Neutral background, content spaced below header
 */
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    // Not authenticated — redirect to login
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      <main className="container mt-5 flex-grow-1 py-3">
        <div className="backdrop-panel">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
