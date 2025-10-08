// src/pages/ProjectManagementPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProjects } from '../features/projects/projectManagementSlice';
import { ProjectTable } from '../components/projects/ProjectTable';
import styles from './UserManagementPage.module.css'; // Reuse the same page layout styles

export const ProjectManagementPage = () => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector(state => state.projectManagement);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProjects());
    }
  }, [status, dispatch]);

  return (
    <div>
      <h1 className={styles.title}>Project Management</h1>
      {status === 'loading' && <p>Loading projects...</p>}
      {status === 'failed' && <p className={styles.error}>Error: {error}</p>}
      {status === 'succeeded' && <ProjectTable projects={projects} />}
    </div>
  );
};