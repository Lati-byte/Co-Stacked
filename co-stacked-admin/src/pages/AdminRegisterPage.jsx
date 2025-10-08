// src/pages/AdminRegisterPage.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdmin } from '../features/auth/adminAuthSlice';
import styles from './AdminLoginPage.module.css'; // Reusing login page styles for consistency
import { Loader2 } from 'lucide-react';

/**
 * The registration page for the administrative dashboard.
 * Provides a form to create a new admin user, requiring a secret key for authorization.
 */
export const AdminRegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Subscribe to the global auth state for status and error feedback
    const { status, error } = useSelector(state => state.auth);

    // Local state for managing all the form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'founder', // Admins can have a default role (can be changed later if needed)
        secretKey: ''
    });

    // A single, generic handler to update the form state
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler for form submission, dispatches the Redux action
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(registerAdmin(formData));

        // If the registration is successful, alert the user and redirect to the login page
        if (registerAdmin.fulfilled.match(resultAction)) {
            alert('Admin user registered successfully! You can now log in.');
            navigate('/login');
        }
        // If it fails, the error from the backend (e.g., "Invalid secret key")
        // will automatically be displayed by the component's render logic.
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Register New Admin</h1>
                    <p className={styles.subtitle}>For authorized personnel only.</p>
                </header>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input id="name" name="name" type="text" className={styles.input} value={formData.name} onChange={handleChange} required autoComplete="name" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input id="email" name="email" type="email" className={styles.input} value={formData.email} onChange={handleChange} required autoComplete="email" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input id="password" name="password" type="password" className={styles.input} value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="secretKey" className={styles.label}>Secret Key</label>
                        <input id="secretKey" name="secretKey" type="password" className={styles.input} value={formData.secretKey} onChange={handleChange} required />
                    </div>
                    
                    {status === 'failed' && error && <p className={styles.error}>{error}</p>}
                    
                    <button type="submit" className={styles.button} disabled={status === 'loading'}>
                        {status === 'loading' ? <Loader2 className={styles.loader}/> : 'Register Admin'}
                    </button>
                </form>

                <div className={styles.footer} style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p>Already have an admin account?{' '}<Link to="/login" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: '500'}}>Login</Link></p>
                </div>
            </div>
        </div>
    );
};