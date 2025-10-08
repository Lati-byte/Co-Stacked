// src/components/profile/ProfileEditor.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../features/auth/authSlice';

import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { Input } from '../shared/Input';
import { Label } from '../shared/Label';
import { Textarea } from '../shared/Textarea';
import { Loader2 } from 'lucide-react';
import styles from './ProfileEditor.module.css';

/**
 * A form component for editing a user's profile.
 * It takes the initial user data as a prop and manages its own form state.
 * When submitted, it dispatches a Redux action to update the profile on the backend.
 */
export const ProfileEditor = ({ user, onSave, onCancel }) => {
    const dispatch = useDispatch();
    // Get the status and error from the AUTH slice to show loading/error states
    const { status, error } = useSelector((state) => state.auth);
    
    // Initialize the form's local state with the user's current data
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: '',
        location: '',
        availability: '',
        portfolioLink: '',
    });
    
    // This effect runs when the 'user' prop changes, ensuring the form
    // is always populated with the latest data from Redux.
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
                location: user.location || '',
                availability: user.availability || '',
                portfolioLink: user.portfolioLink || '',
            });
        }
    }, [user]);

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(updateUserProfile(formData));
        if(updateUserProfile.fulfilled.match(resultAction)){
            alert('Profile updated successfully!');
            onSave(); // Tell the parent page (ProfilePage) to switch back to view mode
        } else {
            // Error is handled automatically by the useSelector, we can just show a generic alert
            alert('Failed to update profile. Please check the error message.');
        }
    };

    return (
        <Card className={styles.card}>
            <form onSubmit={handleSubmit}>
                <h2 className={styles.title}>Edit Your Profile</h2>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Cape Town, WC"/>
                    </div>
                     <div className={styles.formGroupSpan2}>
                        <Label htmlFor="bio">Bio / About Me</Label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                    </div>
                     <div className={styles.formGroupSpan2}>
                        <Label htmlFor="skills">Skills (comma-separated)</Label>
                        <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <Label htmlFor="availability">Availability</Label>
                        <Input id="availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., 20 hours/week" />
                    </div>
                     <div className={styles.formGroup}>
                        <Label htmlFor="portfolioLink">Portfolio/GitHub Link</Label>
                        <Input id="portfolioLink" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} />
                    </div>
                </div>
                
                {status === 'failed' && error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.actions}>
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};