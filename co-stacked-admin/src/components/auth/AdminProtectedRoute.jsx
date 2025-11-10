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

  // --- THIS IS THE FIX ---
  // We only show the loading state when we are ACTIVELY verifying a token
  // (i.e., when getAdminProfile is pending). We should NOT block on 'idle'.
  if (status === 'loading') {
    return <div>Authenticating...</div>; // You can replace this with a full-page spinner
  }
  
  // If the status is 'idle', 'succeeded', or 'failed', this logic will now correctly execute.
  // If not authenticated, navigate the user to the /login page.
  // If authenticated, render the nested content via the <Outlet />.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Good practice to define that this component doesn't expect any props.
AdminProtectedRoute.propTypes = {};