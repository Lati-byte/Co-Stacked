// src/pages/DiscoverProjectsPage.jsx

import { useEffect, useState, useMemo } from 'react'; // Import useMemo
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectsSlice';

// Import necessary UI components
import { ProjectCard } from '../components/shared/ProjectCard';
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
    // Fetch projects only if the state is idle to prevent redundant calls
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  // Memoized hook to efficiently sort and filter projects
  const sortedAndFilteredProjects = useMemo(() => {
    if (!Array.isArray(allProjects)) return [];
    
    const now = new Date();

    return [...allProjects]
      .sort((a, b) => {
        // Sort logic: boosted projects first, then by creation date
        const aIsBoosted = a.isBoosted && new Date(a.boostExpiresAt) > now;
        const bIsBoosted = b.isBoosted && new Date(b.boostExpiresAt) > now;

        if (aIsBoosted && !bIsBoosted) return -1; // a comes first
        if (!aIsBoosted && bIsBoosted) return 1;  // b comes first

        return new Date(b.createdAt) - new Date(a.createdAt); // newest first
      })
      .filter(project => {
        // Filtering logic runs after sorting
        const searchLower = searchQuery.toLowerCase();
        const locationLower = locationQuery.toLowerCase();
        const matchesSearch = project.title.toLowerCase().includes(searchLower) || 
                              (project.skillsNeeded && project.skillsNeeded.some(skill => skill.toLowerCase().includes(searchLower)));
        const matchesLocation = project.location ? project.location.toLowerCase().includes(locationLower) : true;
        return matchesSearch && matchesLocation;
      });
  }, [allProjects, searchQuery, locationQuery]);

  // Split the final list into two sections for rendering
  const now = new Date();
  const featuredProjects = sortedAndFilteredProjects.filter(p => p.isBoosted && new Date(p.boostExpiresAt) > now);
  const latestProjects = sortedAndFilteredProjects.filter(p => !p.isBoosted || new Date(p.boostExpiresAt) <= now);

  let content;

  if (status === 'loading' || status === 'idle') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = (
      <>
        {/* Section 1: Featured Projects (only renders if there are any) */}
        {featuredProjects.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            <div className={styles.grid}>
              {featuredProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>
          </section>
        )}
        
        {/* Section 2: Latest Projects */}
        {latestProjects.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Latest Projects</h2>
            <div className={styles.grid}>
              {latestProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>
          </section>
        )}
        
        {/* Empty state message if no projects match filters */}
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