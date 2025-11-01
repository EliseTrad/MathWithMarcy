import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

/**
 * Landing hero featuring Marceline artwork and platform overview.
 */
const Landing: React.FC = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundImage: 'url(/landing.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <PublicNavbar />
      <section
        className="bg-pink-50 py-5 flex-grow-1"
        style={{ backgroundColor: 'rgba(252, 228, 236, 0.9)' }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5">
            {/* Left: Text and CTA */}
            <div className="col-12 col-lg-6 text-center text-lg-start">
              <h1 className="display-5 fw-bold text-danger mb-3">
                Math practice that feels like play
              </h1>
              <p className="lead text-danger-emphasis mb-4">
                Marceline guides short, meaningful drills that build lasting
                confidence with no cram sessions, just friendly, steady
                progress.
              </p>
              <ul className="list-unstyled text-start text-danger-emphasis mb-4 small">
                <li className="d-flex align-items-center mb-2">
                  <span className="badge rounded-pill bg-danger-subtle text-danger me-3">
                    1
                  </span>
                  Adaptive challenges that keep learners in their sweet spot.
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span className="badge rounded-pill bg-danger-subtle text-danger me-3">
                    2
                  </span>
                  Visual progress tracking to celebrate every win.
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge rounded-pill bg-danger-subtle text-danger me-3">
                    3
                  </span>
                  Encouragement from Marceline to keep the momentum going.
                </li>
              </ul>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link
                  to="/register"
                  className="btn btn-danger btn-lg rounded-pill px-4"
                >
                  Start free practice
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-danger btn-lg rounded-pill px-4"
                >
                  I already have an account
                </Link>
              </div>
            </div>

            {/* Right: Marceline image */}
            <div className="col-12 col-lg-6 text-center">
              <img
                src="/marceline.png"
                alt="Marceline cheering learners on"
                className="img-fluid rounded-4 shadow-sm"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;
