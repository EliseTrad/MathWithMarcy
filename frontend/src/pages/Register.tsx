import React from 'react';
import { useNavigate } from 'react-router-dom';

import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();

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
      <section className="py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6 order-2 order-lg-1">
              <RegisterForm
                onSuccess={({ email }) =>
                  navigate('/login', {
                    replace: true,
                    state: { registered: true, email },
                  })
                }
              />
            </div>
            <div className="col-12 col-lg-6 text-center order-1 order-lg-2">
              <img
                src="/marceline.png"
                alt="Marceline celebrating new math friends"
                className="img-fluid"
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

export default Register;
