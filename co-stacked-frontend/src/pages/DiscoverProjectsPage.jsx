// src/pages/DiscoverProjectsPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectsSlice';

import { ProjectCard } from '../components/shared/ProjectCard';
import styles from './DiscoverProjectsPage.module.css';

// We can create a simple loading component for now
const LoadingSpinner = () => <div className={styles.loader}>Loading projects...</div>;

export const DiscoverProjectsPage = () => {
  const dispatch = useDispatch();

  // 1. Get the projects data, status, and error from the Redux store
  const { items: projects, status, error } = useSelector((state) => state.projects);
  // We rename 'items' to 'projects' for clarity in this component.
  
  // 2. Use the useEffect hook to fetch data when the component first mounts
  useEffect(() => {
    // We only want to fetch if the status is 'idle', to prevent re-fetching on every render.
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]); // The effect depends on status and dispatch

  // 3. Create a variable to hold the content based on the current status
  let content;

  if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    // If we have projects, render the grid. Otherwise, show a 'not found' message.
    content = projects.length > 0 ? (
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} /> // Use _id from MongoDB
        ))}
      </div>
    ) : (
      <p className={styles.noResults}>No projects found. Be the first to post one!</p>
    );
  } else if (status === 'failed') {
    content = <p className={styles.error}>Error: {error}</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Discover Projects</h1>
        <p className={styles.subtitle}>Find your next challenge. Connect with founders and build the future.</p>
        {/* The search component can be re-integrated here. We'll add client-side filtering next. */}
      </header>

      <main className={styles.mainContent}>
        {content}
      </main>
    </div>
  );
};