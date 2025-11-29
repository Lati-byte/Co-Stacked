// src/pages/DashboardPage.jsx

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReceivedInterests, fetchSentInterests } from '../features/interests/interestsSlice';
import { fetchMyProjects } from '../features/projects/projectsSlice';
import { fetchReviewsForUser } from '../features/reviews/reviewsSlice'; // <-- 1. IMPORT
import styles from './DashboardPage.module.css';

// Import our specialized dashboard components
import { FounderDashboard } from '../components/dashboard/FounderDashboard';
import { DeveloperDashboard } from '../components/dashboard/DeveloperDashboard';

/**
 * The DashboardPage is a "smart" container component that fetches all necessary
 * data for the logged-in user and passes it to the appropriate sub-component.
 */
export const DashboardPage = () => {
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.auth);
  // --- THIS IS THE FIX ---
  // Provide a default empty object to the selector. If `state.interests`
  // is undefined for a moment, this will prevent a crash.
  const { receivedItems = [], sentItems = [] } = useSelector(state => state.interests || {});
  const { myItems: userProjects = [] } = useSelector(state => state.projects || {});
  const { reviewsByUser = {} } = useSelector(state => state.reviews || {});
  // --- END FIX ---


  // This effect runs when the user is available and dispatches all necessary data-fetching actions.
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'founder') {
        dispatch(fetchReceivedInterests());
        dispatch(fetchMyProjects());
      } 
      else if (currentUser.role === 'developer') {
        dispatch(fetchSentInterests());
        // --- 3. FETCH reviews specifically for the logged-in developer ---
        dispatch(fetchReviewsForUser(currentUser._id));
      }
    }
  }, [currentUser, dispatch]);
  
  // Show a loading state while the user object is being authenticated.
  if (!currentUser) {
    return <div className={styles.pageContainer}><h2 className={styles.title}>Loading Dashboard...</h2></div>;
  }
  
  // --- 4. GET the specific reviews for the current user from the Redux state ---
  const developerReviews = reviewsByUser[currentUser._id] || [];
  
  return (
    <div className={styles.pageContainer}>
      {/* This switcher logic cleanly separates the UI for each role */}
      {currentUser.role === 'founder' ? (
        <FounderDashboard
          currentUser={currentUser}
          interests={receivedItems}
          userProjects={userProjects}
        />
      ) : (
        <DeveloperDashboard
          currentUser={currentUser}
          sentItems={sentItems}
          // --- 5. PASS the live reviews data as a prop ---
          developerReviews={developerReviews}
        />
      )}
    </div>
  );
};