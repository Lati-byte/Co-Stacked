// src/pages/EditProjectPage.jsx
import { useParams } from 'react-router-dom';
import { ProjectForm } from '../components/forms/ProjectForm';
// We can reuse the same page layout styles from the PostProjectPage
import styles from './PostProjectPage.module.css';

export const EditProjectPage = () => {
  const { projectId } = useParams();

  return (
    <div className={styles.pageContainer}>
      <ProjectForm projectId={projectId} />
    </div>
  );
};