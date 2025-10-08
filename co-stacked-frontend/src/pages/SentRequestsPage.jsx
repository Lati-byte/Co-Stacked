// src/pages/SentRequestsPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSentInterests } from '../features/interests/interestsSlice';
import styles from './RequestsPage.module.css'; // We can reuse the same styles!
import { InterestRequestCard } from '../components/shared/InterestRequestCard';

const LoadingSpinner = () => <div className={styles.message}>Loading your applications...</div>;
const EmptyState = () => <div className={styles.message}>You haven't applied to any projects yet.</div>;
const ErrorState = ({ error }) => <div className={styles.error}>Error: {error}</div>;

export const SentRequestsPage = () => {
  const dispatch = useDispatch();

  // Get the data, status, and error for the SENT interests from the Redux store
  const { 
    sentItems: interests, 
    fetchStatus: status, 
    error 
  } = useSelector((state) => state.interests);
  
  // Fetch the sent interests when the component first mounts
  useEffect(() => {
    // Only dispatch if the data hasn't been fetched yet
    if (status === 'idle') {
      dispatch(fetchSentInterests());
    }
  }, [status, dispatch]);

  let content;
  
  if (status === 'loading' || status === 'idle') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = interests.length > 0 ? (
      <div className={styles.grid}>
        {interests.map((interest) => (
          // Our card is smart, but it's designed for founders.
          // Let's create a developer-focused card next. For now, this will work.
          <InterestRequestCard
            key={interest._id}
            interest={interest}
            // Add a prop to tell the card we're viewing as a developer
            viewerRole="developer" 
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
        <h1 className={styles.title}>My Applications</h1>
        <p className={styles.subtitle}>
          Track the status of all the project requests you have sent.
        </p>
      </header>
      {content}
    </div>
  );
};