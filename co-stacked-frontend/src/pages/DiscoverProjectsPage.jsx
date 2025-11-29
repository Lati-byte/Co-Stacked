// src/pages/DiscoverProjectsPage.jsx

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectsSlice';

// Import necessary UI components
import { ProjectCard } from '../components/shared/ProjectCard';
import { Carousel } from '../components/shared/Carousel'; // <-- 1. IMPORT the Carousel
import { CombinedSearchInput } from '../components/shared/CombinedSearchInput';
import styles from './DiscoverProjectsPage.module.css';

const LoadingSpinner = () => <div className={styles.loader}>Loading projects...</div>;
const ErrorDisplay = ({ error }) => <p className={styles.error}>Error: {error}</p>;

export const DiscoverProjectsPage = () => {
  const dispatch = useDispatch();

  const { items: allProjects, status, error } = useSelector((state) => state.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  // The sorting and filtering logic remains exactly the same.
  const sortedAndFilteredProjects = useMemo(() => { /* ... existing logic ... */ });
  const featuredProjects = sortedAndFilteredProjects.filter(p => p.isBoosted && new Date(p.boostExpiresAt) > new Date());
  const latestProjects = sortedAndFilteredProjects.filter(p => !p.isBoosted || new Date(p.boostExpiresAt) <= new Date());

  let content;

  if (status === 'loading' || status === 'idle') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = (
      <>
        {/* --- Section 1: Featured Projects --- */}
        {featuredProjects.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            {/* --- 2. REPLACE the div with the Carousel component --- */}
            <Carousel>
              {featuredProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
            </Carousel>
          </section>
        )}
        
        {/* --- Section 2: Latest Projects --- */}
        {latestProjects.length > 0 && (
          <section className={styles.latestSection}>
            <h2 className={styles.sectionTitle}>Latest Projects</h2>
            <div className={styles.grid}>
              {latestProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>
          </section>
        )}
        
        {sortedAndFilteredProjects.length === 0 && (
          <p className={styles.noResults}>No projects found matching your criteria. Be the first to post one!</p>
        )}
      </>
    );
  } else if (status === 'failed') {
    content = <ErrorDisplay error={error} />;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Discover Projects</h1>
        <p className={styles.subtitle}>Find your next challenge. Connect with founders and build the future.</p>
        
        <div className={styles.filtersWrapper}>
            <CombinedSearchInput
              searchValue={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              locationValue={locationQuery}
              onLocationChange={(e) => setLocationQuery(e.target.value)}
              searchPlaceholder="Search by title or skill..."
              locationPlaceholder="e.g., Cape Town, WC or Remote"
            />
        </div>
      </header>

      <main className={styles.mainContent}>
        {content}
      </main>
    </div>
  );
};