// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthMessages } from '../features/auth/authSlice';

import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { Button } from '../components/shared/Button';
import { Loader2 } from 'lucide-react';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, error, unverifiedEmail } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear old messages on mount
  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear any previous errors
    dispatch(clearAuthMessages());

    const resultAction = await dispatch(loginUser({ email, password }));

    // SUCCESS: Login worked → token + user saved by authSlice → redirect
    if (loginUser.fulfilled.match(resultAction)) {
      // Optional: Save to localStorage again (in case your slice doesn't persist)
      const { user, token } = resultAction.payload;
      localStorage.setItem('userToken', token);
      localStorage.setItem('userProfile', JSON.stringify(user));

      navigate('/dashboard');
      return;
    }

    // FAILURE: Check why it failed
    if (loginUser.rejected.match(resultAction)) {
      const payload = resultAction.payload;

      // Case 1: Email not verified → send to verification page
      if (payload?.emailNotVerified) {
        navigate('/verify-email', { state: { email } }); // Pass email so verify page pre-fills it
        return;
      }

      // Case 2: Wrong credentials or server error → error is already in Redux state
      // Error message will show below the form
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome Back!</h1>
          <p className={styles.description}>
            Enter your credentials to access your account.
          </p>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.passwordHeader}>
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Show backend errors */}
            {status === 'failed' && error && (
              <p className={styles.error}>{error}</p>
            )}

            {/* Show specific unverified message if needed */}
            {status === 'failed' && unverifiedEmail && (
              <p className={styles.error}>
                Please verify your email first. Check your inbox for the code.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === 'loading'}
              className={styles.submitButton}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className={styles.footer}>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className={styles.link}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};