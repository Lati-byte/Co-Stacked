// src/pages/DashboardPage.jsx

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReceivedInterests, fetchSentInterests } from '../features/interests/interestsSlice';
import { fetchMyProjects } from '../features/projects/projectsSlice';
import styles from './DashboardPage.module.css';

// 1. Import our new, specialized dashboard components
import { FounderDashboard } from '../components/dashboard/FounderDashboard';
import { DeveloperDashboard } from '../components/dashboard/DeveloperDashboard';

// We still need mock data for conversations
import { mockConversations } from '../data/mock.js';

export const DashboardPage = () => {
  const dispatch = useDispatch();

  // === FETCH ALL NECESSARY DATA FROM REDUX ===
  const { user: currentUser } = useSelector((state) => state.auth);
  const { receivedItems, sentItems, fetchStatus: interestsStatus } = useSelector(state => state.interests);
  const { myItems: userProjects, status: projectsStatus } = useSelector(state => state.projects);

  // Fetch all necessary data for both roles
  useEffect(() => {
    if (currentUser) {
      if (interestsStatus === 'idle') {
        if (currentUser.role === 'founder') dispatch(fetchReceivedInterests());
        if (currentUser.role === 'developer') dispatch(fetchSentInterests());
      }
      if (currentUser.role === 'founder' && projectsStatus === 'idle') {
        dispatch(fetchMyProjects());
      }
    }
  }, [currentUser, interestsStatus, projectsStatus, dispatch]);
  
  // Loading state
  if (!currentUser) {
    return <div className={styles.pageContainer}><h2 className={styles.title}>Loading Dashboard...</h2></div>;
  }
  
  // Data for the Founder view
  const activeConversations = mockConversations.filter(c => c.participants.includes(currentUser._id));
  
  return (
    <div className={styles.pageContainer}>
      {/* 2. THE NEW, CLEAN SWITCHER LOGIC */}
      {currentUser.role === 'founder' ? (
        <FounderDashboard
          currentUser={currentUser}
          interests={receivedItems}
          userProjects={userProjects}
          activeConversations={activeConversations}
        />
      ) : (
        <DeveloperDashboard
          currentUser={currentUser}
          sentItems={sentItems}
        />
      )}
    </div>
  );
};