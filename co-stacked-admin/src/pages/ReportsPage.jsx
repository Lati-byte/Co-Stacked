// src/pages/ReportsPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageTitle } from '../context/PageTitleContext';
import { fetchReports } from '../features/reports/reportsSlice';
import { ReportsTable } from '../components/reports/ReportsTable';
import styles from './UserManagementPage.module.css'; // Reuse styles

export const ReportsPage = () => {
  const dispatch = useDispatch();
  const { setTitle } = usePageTitle();
  const { reports, status, error } = useSelector(state => state.reports);

  useEffect(() => {
    setTitle('Content Moderation');
    if (status === 'idle') {
      dispatch(fetchReports());
    }
  }, [status, dispatch, setTitle]);

  return (
    <div>
      {status === 'loading' && <p>Loading reports...</p>}
      {status === 'failed' && <p className={styles.error}>Error: {error}</p>}
      {status === 'succeeded' && (
        reports.length > 0
          ? <ReportsTable reports={reports} />
          : <p>No open reports. Great job!</p>
      )}
    </div>
  );
};