// src/components/users/EditUserModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/users/userManagementSlice';

import { Dialog } from '../shared/Dialog';
import { Button } from '../ui/Button'; // Assuming you created a simple Button component
import styles from './EditUserModal.module.css';
import PropTypes from 'prop-types';

/**
 * A modal form for administrators to edit a user's details.
 */
export const EditUserModal = ({ user, open, onClose }) => {
    const dispatch = useDispatch();
    // Get the global status to disable the save button while an action is in progress
    const { status } = useSelector(state => state.userManagement);
    
    const [formData, setFormData] = useState({ name: '', role: '', isAdmin: false });

    // This `useEffect` hook runs whenever the `user` prop changes.
    // It's crucial for populating the form when the modal opens.
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                role: user.role || 'developer',
                isAdmin: user.isAdmin || false,
            });
        }
    }, [user]);

    // A generic handler for all form inputs
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    };

    // Handler for form submission
    const handleSubmit = () => {
        // Dispatch the updateUser async thunk with the user's ID and the new form data
        dispatch(updateUser({ userId: user._id, userData: formData }));
        // Close the modal immediately (optimistic update)
        onClose();
    };

    // Don't render the modal if it's not supposed to be open or if there's no user data
    if (!open || !user) {
      return null;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <h2 className={styles.title}>Edit User: {user.name}</h2>
            
            <div className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input id="name" name="name" value={formData.name} onChange={handleChange} className={styles.input}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="role">User Role</label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange} className={styles.input}>
                        <option value="developer">Developer</option>
                        <option value="founder">Founder</option>
                    </select>
                </div>
                <div className={styles.checkboxGroup}>
                    <input name="isAdmin" type="checkbox" checked={formData.isAdmin} onChange={handleChange} id={`isAdminCheck-${user._id}`}/>
                    <label htmlFor={`isAdminCheck-${user._id}`}>Make this user an Administrator</label>
                </div>
            </div>

            <footer className={styles.footer}>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Saving...' : 'Save Changes'}
                </Button>
            </footer>
        </Dialog>
    );
};

EditUserModal.propTypes = {
  user: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};