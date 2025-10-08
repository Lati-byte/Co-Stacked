// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';

import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { Button } from '../components/shared/Button';
import { Loader2, Github } from 'lucide-react';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth status and error from the Redux store
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = { email, password };

    // Dispatch the loginUser async thunk
    const resultAction = await dispatch(loginUser(credentials));
    
    // If the login was successful, navigate to the dashboard
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
    // If it failed, the error message will be shown automatically
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome Back!</h1>
          <p className={styles.description}>Enter your credentials to access your account.</p>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Display error message from Redux state */}
            {status === 'failed' && <p className={styles.error}>{error}</p>}
            
            <Button type="submit" variant="primary" disabled={status === 'loading'}>
              {status === 'loading' ? (<><Loader2 className="animate-spin mr-2" /> Logging in...</>) : ( "Login" )}
            </Button>
          </form>

          <div className={styles.footer}>
            <p>Don't have an account?{' '}<Link to="/signup" className="font-semibold text-primary hover:underline">Sign Up</Link></p>
          </div>
        </div>
      </Card>
    </div>
  );
};