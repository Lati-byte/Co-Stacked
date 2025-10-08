// src/components/projects/EditProjectModal.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProject } from '../../features/projects/projectManagementSlice';
import { Dialog } from '../shared/Dialog';
import { Button } from '../ui/Button'; // Assuming you have a standard Button component
import styles from './EditProjectModal.module.css';
import PropTypes from 'prop-types';

/**
 * A modal form for administrators to edit a project's details.
 */
export const EditProjectModal = ({ project, open, onClose }) => {
    const dispatch = useDispatch();
    const { status } = useSelector(state => state.projectManagement);
    
    // Local state for the form fields
    const [formData, setFormData] = useState({ title: '', description: '' });

    // This effect pre-populates the form with the project's data when the modal opens
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
            });
        }
    }, [project]);

    // Handler for form input changes
    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handler for form submission
    const handleSubmit = () => {
        dispatch(updateProject({ projectId: project._id, projectData: formData }));
        onClose(); // Close the modal optimistically
    };

    // Don't render anything if the modal isn't open or has no project data
    if (!open || !project) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <h2 className={styles.title}>Edit Project</h2>
            <p className={styles.subtitle}>{project.title}</p>
            
            <div className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Project Title</label>
                    <input id="title" name="title" value={formData.title} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows="6" 
                      className={styles.input} 
                    />
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

EditProjectModal.propTypes = {
  project: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};