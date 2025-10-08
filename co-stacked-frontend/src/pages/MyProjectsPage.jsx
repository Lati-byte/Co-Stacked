// src/pages/MyProjectsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyProjects, deleteProject } from '../features/projects/projectsSlice';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { ConfirmationModal } from '../components/shared/ConfirmationModal';
import styles from './MyProjectsPage.module.css';

const LoadingSpinner = () => <div className={styles.message}>Loading your projects...</div>;

export const MyProjectsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Get the user's projects from the Redux store
  const { myItems: myProjects, status, error } = useSelector((state) => state.projects);

  useEffect(() => {
    // We fetch every time the page loads to ensure the data is fresh,
    // but you could add a status check if you prefer to only fetch once.
    dispatch(fetchMyProjects());
  }, [dispatch]);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await dispatch(deleteProject(projectToDelete._id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      // Optional: show a toast notification for success
    }
  };

  let content;
  if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = myProjects.length > 0 ? (
      <div className={styles.projectList}>
        {myProjects.map(project => (
          <Card key={project._id} className={styles.projectCard}>
            <div>
              <p className={styles.projectTitle}>{project.title}</p>
              <p className={styles.projectStatus}>
                Stage: {project.stage} &bull; Posted on {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.projectActions}>
              <Button variant="secondary" to={`/projects/edit/${project._id}`}>Edit</Button>
              <Button onClick={() => handleDeleteClick(project)} className={styles.deleteButton}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <div className={styles.message}>
        <p>You haven't posted any projects yet.</p>
        <Button to="/post-project" style={{marginTop: '1rem'}}>Post Your First Project</Button>
      </div>
    );
  } else if (status === 'failed') {
    content = <p className={styles.error}>{error}</p>;
  }

  return (
    <>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
      />
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>My Projects</h1>
          <Button to="/post-project">Post New Project</Button>
        </header>
        {content}
      </div>
    </>
  );
};