// src/pages/VerifyEmailPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyEmail, clearAuthMessages } from '../features/auth/authSlice';

import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { Button } from '../components/shared/Button';
import { Loader2 } from 'lucide-react';
import styles from './LoginPage.module.css'; // Reuse login page styles for consistency

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, error, successMessage, unverifiedEmail } = useSelector(state => state.auth);
  
  const [token, setToken] = useState('');

  // This effect protects the route. If a user lands here without having just
  // registered (i.e., no unverifiedEmail in state), it redirects them to the signup page.
  useEffect(() => {
    if (!unverifiedEmail) {
      navigate('/signup');
    }
    // Clean up any old messages when the component loads
    return () => {
      dispatch(clearAuthMessages());
    }
  }, [unverifiedEmail, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !unverifiedEmail) return;

    const resultAction = await dispatch(verifyEmail({ email: unverifiedEmail, token }));

    if (verifyEmail.fulfilled.match(resultAction)) {
      // On success, wait a moment for the user to read the success message, then redirect to login.
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Check Your Email</h1>
          <p className={styles.description}>
            We've sent a 6-digit verification code to <strong>{unverifiedEmail || 'your email address'}</strong>.
          </p>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <Label htmlFor="token">Verification Code (OTP)</Label>
              <Input 
                id="token" 
                type="text" 
                value={token} 
                onChange={(e) => setToken(e.target.value)} 
                maxLength="6"
                required 
              />
            </div>

            {/* Display feedback messages from Redux state */}
            {status === 'failed' && error && <p className={styles.error}>{error}</p>}
            {status === 'succeeded' && successMessage && <p className={styles.success}>{successMessage}</p>}
            
            <Button type="submit" variant="primary" disabled={status === 'loading' || !!successMessage}>
              {status === 'loading' ? (<><Loader2 className="animate-spin mr-2" /> Verifying...</>) : ( "Verify Account" )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};