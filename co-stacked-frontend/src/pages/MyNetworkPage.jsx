// src/pages/MyNetworkPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConnections } from '../features/connections/connectionsSlice';
import { UserCard } from '../components/shared/UserCard'; // Reuse the existing UserCard
import styles from './MyNetworkPage.module.css';

const LoadingSpinner = () => <div className={styles.message}>Loading your network...</div>;
const EmptyState = () => <div className={styles.message}>You haven't made any connections yet.</div>;
const ErrorState = ({ error }) => <div className={styles.error}>Error: {error}</div>;

export const MyNetworkPage = () => {
  const dispatch = useDispatch();

  // Get the connections data and status from the Redux store
  const { connections, status, error } = useSelector(state => state.connections);
  const connectionCount = connections.length;

  // Fetch the connections when the component first mounts
  useEffect(() => {
    // Only fetch if the data hasn't been loaded yet to avoid redundant calls
    if (status === 'idle') {
      dispatch(fetchConnections());
    }
  }, [status, dispatch]);

  let content;
  if (status === 'loading' || status === 'idle') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = connectionCount > 0 ? (
      <div className={styles.grid}>
        {connections.map((user) => (
          <UserCard key={user._id} user={user} />
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
        <h1 className={styles.title}>My Network</h1>
        {status === 'succeeded' && (
          <p className={styles.subtitle}>
            You have {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}.
          </p>
        )}
      </header>
      
      <main>
        {content}
      </main>
    </div>
  );
};