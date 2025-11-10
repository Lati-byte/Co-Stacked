// src/pages/MyProjectsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyProjects, deleteProject } from '../features/projects/projectsSlice';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { ConfirmationModal } from '../components/shared/ConfirmationModal';
import styles from './MyProjectsPage.module.css';
// --- 1. IMPORT THE ROCKET ICON ---
import { Rocket } from 'lucide-react';

// Helper function to format dates nicely for the UI
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

const LoadingSpinner = () => <div className={styles.message}>Loading your projects...</div>;

export const MyProjectsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const { myItems: myProjects, status, error } = useSelector((state) => state.projects);

  useEffect(() => {
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
    }
  };

  let content;
  if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = myProjects.length > 0 ? (
      <div className={styles.projectList}>
        {myProjects.map(project => {
          // --- 2. ADD LOGIC TO CHECK IF BOOST IS ACTIVE ---
          const isBoostedActive = project.isBoosted && new Date(project.boostExpiresAt) > new Date();
          return (
            <Card key={project._id} className={styles.projectCard}>
              <div>
                <p className={styles.projectTitle}>{project.title}</p>

                {/* --- 3. CONDITIONALLY RENDER THE BOOST NOTIFICATION --- */}
                {isBoostedActive ? (
                  <p className={styles.boostStatus}>
                    <Rocket size={14} />
                    Boosted until {formatDate(project.boostExpiresAt)}
                  </p>
                ) : (
                  <p className={styles.projectStatus}>
                    Stage: {project.stage} &bull; Posted on {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className={styles.projectActions}>
                <Button variant="secondary" to={`/projects/edit/${project._id}`}>Edit</Button>
                <Button onClick={() => handleDeleteClick(project)} className={styles.deleteButton}>Delete</Button>
              </div>
            </Card>
          );
        })}
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