// src/pages/RequestsPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivedInterests } from '../features/interests/interestsSlice';
import styles from './RequestsPage.module.css';
import { InterestRequestCard } from '../components/shared/InterestRequestCard';

const LoadingSpinner = () => <div className={styles.message}>Loading requests...</div>;
const EmptyState = () => <div className={styles.message}>You have no new connection requests.</div>;
const ErrorState = ({ error }) => <div className={styles.error}>Error: {error}</div>;

export const RequestsPage = () => {
  const dispatch = useDispatch();

  // Get the data, status, and error for the received interests from the Redux store
  const { 
    receivedItems: interests, 
    fetchStatus: status, 
    error 
  } = useSelector((state) => state.interests);
  
  // Fetch the received interests when the component first mounts
  useEffect(() => {
    // Only dispatch if the data hasn't been fetched yet
    if (status === 'idle') {
      dispatch(fetchReceivedInterests());
    }
  }, [status, dispatch]);

  let content;
  
  if (status === 'loading' || status === 'idle') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    // We now filter for only 'pending' requests to be shown on this page as actionable items
    const pendingInterests = interests.filter(i => i.status === 'pending');

    content = pendingInterests.length > 0 ? (
      <div className={styles.grid}>
        {pendingInterests.map((interest) => (
          // We can now pass the full interest object to the card
          <InterestRequestCard
            key={interest._id}
            interest={interest}
          />
        ))}
      </div>
    ) : (
      <EmptyState />
    );
  } else if (status === 'failed') {
    content = <ErrorState error={error} />;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Connection Requests</h1>
        <p className={styles.subtitle}>
          Review and respond to developers who have shown interest in your projects.
        </p>
      </header>
      
      {content}
    </div>
  );
};