// src/pages/AdminVerifyEmailPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// We'll create verifyAdminEmail in the next step
import { verifyAdminEmail, clearAuthState } from '../features/auth/adminAuthSlice';
import styles from './AdminLoginPage.module.css'; // Reuse styles for consistency
import { Loader2 } from 'lucide-react';

export const AdminVerifyEmailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // We need to track the unverified email from the auth slice
  const { status, error, successMessage, unverifiedEmail } = useSelector(state => state.auth);
  
  const [token, setToken] = useState('');

  // Protect this route. If a user lands here without an unverified email in the state,
  // redirect them to the registration page.
  useEffect(() => {
    if (!unverifiedEmail) {
      navigate('/register');
    }
    // Clear any previous messages when the component loads
    return () => {
        dispatch(clearAuthState());
    }
  }, [unverifiedEmail, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !unverifiedEmail) return;

    const resultAction = await dispatch(verifyAdminEmail({ email: unverifiedEmail, token }));

    if (verifyAdminEmail.fulfilled.match(resultAction)) {
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Verify Your Admin Account</h1>
          <p className={styles.description}>
            A 6-digit verification code has been sent to <strong>{unverifiedEmail}</strong>.
          </p>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="token" className={styles.label}>Verification Code</label>
              <input 
                id="token" 
                type="text"
                className={styles.input}
                value={token} 
                onChange={(e) => setToken(e.target.value)} 
                maxLength="6"
                required 
              />
            </div>

            {status === 'failed' && error && <p className={styles.error}>{error}</p>}
            {status === 'succeeded' && successMessage && <p className={styles.success}>{successMessage}</p>}
            
            <button type="submit" className={styles.button} disabled={status === 'loading' || !!successMessage}>
              {status === 'loading' ? <Loader2 className="animate-spin" /> : "Verify Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};