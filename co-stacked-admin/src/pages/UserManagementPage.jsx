// src/pages/UserManagementPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../features/users/userManagementSlice';
import { UserTable } from '../components/users/UserTable';
import styles from './UserManagementPage.module.css';

export const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector(state => state.userManagement);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllUsers());
    }
  }, [status, dispatch]);

  return (
    <div>
      <h1 className={styles.title}>User Management</h1>
      {status === 'loading' && <p>Loading users...</p>}
      {status === 'failed' && <p className={styles.error}>Error: {error}</p>}
      {status === 'succeeded' && <UserTable users={users} />}
    </div>
  );
};