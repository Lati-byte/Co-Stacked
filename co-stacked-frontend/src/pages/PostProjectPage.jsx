// src/pages/PostProjectPage.jsx
import { ProjectForm } from '../components/forms/ProjectForm';
import styles from './PostProjectPage.module.css';

export const PostProjectPage = () => {
  return (
    <div className={styles.pageContainer}>
      <ProjectForm />
    </div>
  );
};