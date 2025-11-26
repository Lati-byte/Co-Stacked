// src/components/auth/ProtectedRoute.jsx

import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A robust wrapper for protecting routes, designed for nested routing.
 * It handles the initial authentication check gracefully.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. If we are actively checking for a token (on app load), show a loading state.
  // This is the key to preventing flickers for already logged-in users.
  if (status === 'loading') {
    // For a better user experience, replace this with a full-page spinner component.
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Authenticating...</div>;
  }

  // 2. If we are done checking ('succeeded', 'failed', or 'idle') AND the user is authenticated...
  if (isAuthenticated) {
    // ...render the child route that this component is protecting (e.g., DashboardPage).
    // The <Outlet /> component is used for nested routing as defined in router.jsx
    return <Outlet />;
  }

  // 3. If we are done checking AND the user is NOT authenticated...
  // ...redirect them to the login page.
  // We pass the location they were trying to access, so we can send them back after login.
  return <Navigate to="/login" state={{ from: location }} replace />;
};

// This component no longer accepts a `children` prop in a nested routing setup.
ProtectedRoute.propTypes = {};