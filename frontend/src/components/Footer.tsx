/**
 * Purpose: Reusable footer with brand links and decorative Marceline image.
 */
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-5 mt-auto">
      <div className="container d-flex flex-column align-items-center text-center gap-3">
        <p className="text-white fw-bold small mb-0">
          &copy; {new Date().getFullYear()} MathWithMarcy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
