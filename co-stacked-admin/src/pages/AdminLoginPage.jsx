// src/pages/AdminLoginPage.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../features/auth/adminAuthSlice';
import styles from './AdminLoginPage.module.css';
import { Loader2 } from 'lucide-react';

/**
 * The login page for the administrative dashboard.
 * Handles form input, dispatches the login action to Redux,
 * and displays loading/error states from the global auth state.
 */
export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Subscribe to the status and error from the adminAuthSlice.
  // The UI will reactively update based on these values.
  const { status, error } = useSelector((state) => state.auth);

  // Local state for managing the email and password input fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handler for form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    
    // Dispatch our loginAdmin async thunk. This triggers the API call.
    const resultAction = await dispatch(loginAdmin(credentials));
    
    // If the thunk's promise is 'fulfilled', it means the API call
    // and the `isAdmin` check were both successful.
    if (loginAdmin.fulfilled.match(resultAction)) {
      // On success, redirect the user to the main dashboard page.
      navigate('/');
    }
    // If the thunk is 'rejected', the `status` in the Redux store will
    // become 'failed', and the error message will be displayed automatically.
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>CoStacked Admin Panel</h1>
          <p className={styles.subtitle}>Please sign in to continue</p>
        </header>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input 
              id="email" 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="email" 
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              id="password" 
              type="password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="current-password" 
              required
            />
          </div>

          {/* This error message comes directly from the Redux state after a failed API call */}
          {status === 'failed' && error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? <Loader2 className={styles.loader} /> : "Sign In"}
          </button>
        </form>

        <div className={styles.footer} style={{marginTop: '1.5rem', textAlign: 'center'}}>
          <Link to="/register" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: '500'}}>
              Register a new admin account
          </Link>
        </div>
      </div>
    </div>
  );
};