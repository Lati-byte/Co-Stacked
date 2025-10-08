// src/components/auth/AdminProtectedRoute.jsx

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A private route wrapper that reads the LIVE auth state from Redux.
 * It acts as a gatekeeper for protected pages.
 */
export const AdminProtectedRoute = () => {
  // Get the real isAuthenticated flag and status from our adminAuthSlice
  const { isAuthenticated, status } = useSelector(state => state.auth);

  // While we are verifying the token on app load, show a loading state.
  // This prevents a "flicker" to the login page for already logged-in admins.
  if (status === 'loading' || status === 'idle') {
    return <div>Authenticating...</div>; // You can replace this with a full-page spinner
  }
  
  // If authenticated, render the nested content via the <Outlet />.
  // If not authenticated, navigate the user to the /login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Good practice to define that this component doesn't expect any props.
AdminProtectedRoute.propTypes = {};