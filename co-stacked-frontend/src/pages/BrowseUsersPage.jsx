// src/pages/BrowseUsersPage.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/users/usersSlice';
import styles from './BrowseUsersPage.module.css';

import { UserCard } from '../components/shared/UserCard';
import { CombinedSearchInput } from '../components/shared/CombinedSearchInput';

// A simple loading component, similar to the one in DiscoverProjectsPage
const LoadingSpinner = () => <div className={styles.loader}>Loading talent...</div>;

export const BrowseUsersPage = () => {
  const dispatch = useDispatch();
  
  // 1. Get the LIVE data from the Redux store
  // We get the list of all users, the data fetching status, and any potential error
  const { items: allUsers, status, error } = useSelector((state) => state.users);
  // We also need the current logged-in user's data for location comparison
  const { user: currentUser } = useSelector((state) => state.auth);

  // Local state for the search and filter inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  // Fetch the users when the component first mounts
  useEffect(() => {
    // Only fetch if the data hasn't been fetched yet
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);
  
  // --- Client-Side Filtering Logic ---
  // This logic runs on every re-render, so it's always up-to-date with the search queries
  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const locationLower = locationQuery.toLowerCase();
    
    const matchesSearch = 
      user.name.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchLower)));

    const matchesLocation = user.location ? user.location.toLowerCase().includes(locationLower) : true;
    
    return matchesSearch && matchesLocation;
  });
  
  const localUsers = currentUser 
    ? filteredUsers.filter(user => user.location === currentUser.location && user._id !== currentUser.id)
    : [];
  
  const globalUsers = currentUser
    ? filteredUsers.filter(user => user.location !== currentUser.location && user._id !== currentUser.id)
    : filteredUsers; // If no user is logged in, all users are "global"


  // --- Conditional Rendering Logic ---
  let content;

  if (status === 'loading' || status === 'idle') {
    content = <LoadingSpinner />;
  } else if (status === 'succeeded') {
    content = (
      <>
        {localUsers.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Developers in your area</h2>
            <div className={styles.grid}>
              {localUsers.map((user) => <UserCard key={user._id} user={user} />)}
            </div>
          </section>
        )}
        {globalUsers.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Global Developers</h2>
            <div className={styles.grid}>
              {globalUsers.map((user) => <UserCard key={user._id} user={user} />)}
            </div>
          </section>
        )}
        {filteredUsers.length === 0 && (
          <p className={styles.noResults}>No developers found matching your criteria.</p>
        )}
      </>
    );
  } else if (status === 'failed') {
    content = <p className={styles.error}>{error}</p>;
  }


  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Find Talent</h1>
        <CombinedSearchInput
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          locationValue={locationQuery}
          onLocationChange={(e) => setLocationQuery(e.target.value)}
          searchPlaceholder="Search by name, role, or skill..."
          locationPlaceholder="e.g., Cape Town, WC"
        />
      </header>

      <main className={styles.mainContent}>
        {content}
      </main>
    </div>
  );
};