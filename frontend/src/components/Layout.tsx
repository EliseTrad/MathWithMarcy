import React from 'react';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

/**
 * Layout component with navbar and footer for authenticated pages.
 * This wraps pages like Home, Dashboard, and Profile.
 * Does NOT appear on landing, login, or register pages.
 */
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <PublicNavbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
