// src/pages/ReportsPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageTitle } from '../context/PageTitleContext';
// --- THIS IS THE FIX ---
// Changed the import name from 'fetchReports' to 'fetchAllReports'
import { fetchAllReports } from '../features/reports/reportsSlice';
import { ReportsTable } from '../components/reports/ReportsTable';
import styles from './UserManagementPage.module.css'; // Reuse styles

export const ReportsPage = () => {
  const dispatch = useDispatch();
  const { setTitle } = usePageTitle();
  
  const { reports, status, error } = useSelector(state => state.reports);

  useEffect(() => {
    setTitle('Content Moderation');
    if (status === 'idle') {
      // Use the correctly named action
      dispatch(fetchAllReports());
    }
  }, [status, dispatch, setTitle]);

  return (
    <div>
      {/* The h1 is handled by the PageTitleContext */}
      
      {status === 'loading' && <p>Loading open reports...</p>}
      {status === 'failed' && <p className={styles.error}>Error: {error}</p>}
      {status === 'succeeded' && (
        reports.length > 0 ? (
          <ReportsTable reports={reports} />
        ) : (
          <p>There are no open reports to moderate.</p>
        )
      )}
    </div>
  );
};