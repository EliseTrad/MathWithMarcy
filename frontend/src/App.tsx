import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import ProtectedLayout from './components/ProtectedLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Questions from './pages/Questions';

/**
 * Root application component with routing.
 *
 * Pages WITHOUT navbar/footer: /landing, /login, /register
 * Pages WITH navbar/footer: /, /profile, /questions (via ProtectedLayout)
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Public pages WITHOUT navbar/footer */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />

        {/* Protected routes WITH navbar and footer (wrapped in ProtectedLayout) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/questions" element={<Questions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
