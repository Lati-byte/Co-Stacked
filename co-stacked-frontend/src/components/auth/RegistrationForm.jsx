// src/components/auth/RegistrationForm.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';
import styles from './RegistrationForm.module.css';

// Import all required UI components
import { Card } from '../shared/Card';
import { Input } from '../shared/Input';
import { Label } from '../shared/Label';
import { Button } from '../shared/Button';
import { RadioGroup } from '../shared/RadioGroup';
import { Textarea } from '../shared/Textarea';
import { Loader2 } from 'lucide-react';

const roleOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'founder', label: 'Founder / Creative' }
];

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer',
    bio: '',
    skills: '',
    location: '',
    availability: '',
    portfolioLink: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));

    // ==========================================================
    // THIS IS THE ONLY CHANGE
    // If registration is successful, redirect to the login page.
    // ==========================================================
    if (registerUser.fulfilled.match(resultAction)) {
      // You could also show a success toast here before navigating
      navigate('/login');
    }
  };

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <h1 className={styles.title}>Create Your CoStacked Account</h1>
        <p className={styles.description}>Tell us a bit about yourself to get started.</p>
      </header>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* === Core Account Fields === */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
            <div className={styles.formGroup}>
              <Label>Your Role</Label>
              <RadioGroup name="role" options={roleOptions} selectedValue={formData.role} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.separator} />
          
          {/* === Profile Detail Fields === */}
          <div className={styles.formGroup}>
            <Label htmlFor="bio">Your Bio / About Me</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="e.g., Passionate frontend developer with a love for React..." />
          </div>
          <div className={styles.formGroup}>
            <Label htmlFor="skills">Your Skills (comma-separated)</Label>
            <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., TypeScript, Node.js, Figma" />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Cape Town, WC" />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="availability">Availability</Label>
              <Input id="availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., 20 hours/week" />
            </div>
            <div className={styles.formGroupSpan2}>
              <Label htmlFor="portfolioLink">Portfolio/GitHub Link</Label>
              <Input id="portfolioLink" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} />
            </div>
          </div>

          {status === "failed" && <p className={styles.error}>{error}</p>}
          
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? (<><Loader2 className={styles.loader}/> Creating Account...</>) : 'Create Account'}
          </Button>
        </form>
        
        <div className={styles.footer}>
          <p>Already have an account?{' '}<Link to="/login" className={styles.link}>Login</Link></p>
        </div>
      </div>
    </Card>
  );
};