// src/components/auth/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A wrapper component that protects routes requiring authentication.
 * This version uses the `children` prop, which is perfect for a flat routing structure.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show a loading indicator while the auth status is being determined
  // This prevents flickering on page refresh for logged-in users.
  if (status === 'loading') {
    return <div>Loading...</div>; // Replace with a real spinner component if you have one
  }

  // If the user is authenticated, render the page they are trying to access.
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, redirect to the login page.
  // We pass the `location` they were trying to visit in the state,
  // so we can redirect them back after they successfully log in.
  return <Navigate to="/login" state={{ from: location }} replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};