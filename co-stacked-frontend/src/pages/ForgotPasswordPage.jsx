// src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../features/auth/authSlice'; // We will create this

import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { Button } from '../components/shared/Button';
import { Loader2 } from 'lucide-react';
import styles from './LoginPage.module.css'; // Reuse login styles

export const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { status, error, successMessage } = useSelector(state => state.auth);
  
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Forgot Your Password?</h1>
          <p className={styles.description}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {status === 'failed' && error && <p className={styles.error}>{error}</p>}
            {status === 'succeeded' && successMessage && <p className={styles.success}>{successMessage}</p>}
            
            <Button type="submit" variant="primary" disabled={status === 'loading' || !!successMessage}>
              {status === 'loading' ? (<><Loader2 className="animate-spin mr-2" /> Sending...</>) : ( "Send Reset Link" )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};