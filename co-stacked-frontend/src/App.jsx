// src/App.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppRouter } from './router';
import { getUserProfile } from './features/auth/authSlice';

/**
 * The root component of the application.
 * It's the perfect place to run app-wide initialization logic.
 */
function App() {
  const dispatch = useDispatch();
  // We get the token from the initial state of our Redux store
  const { token } = useSelector(state => state.auth);

  // This useEffect hook will run once when the App component first mounts.
  useEffect(() => {
    // Check if a token exists in our state (which was loaded from localStorage).
    if (token) {
      // If a token exists, dispatch the action to fetch the user's profile.
      // This will verify the token and update the auth `status` from 'idle' to 'succeeded' or 'failed'.
      dispatch(getUserProfile());
    }
  }, [dispatch, token]); // The dependencies ensure this runs only when needed.

  return <AppRouter />;
}

export default App;