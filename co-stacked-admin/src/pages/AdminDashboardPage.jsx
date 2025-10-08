// src/pages/AdminDashboardPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageTitle } from '../context/PageTitleContext'; // 1. Import the custom hook for the title
import { fetchDashboardStats } from '../features/dashboard/dashboardSlice';

// Import UI Components
import { AdminStatCard } from '../components/dashboard/AdminStatCard';
import { Users, Briefcase, DollarSign, UserPlus } from 'lucide-react';
import styles from './AdminDashboardPage.module.css';

const LoadingSpinner = () => <p>Loading dashboard statistics...</p>;
const ErrorDisplay = ({ error }) => <p className={styles.error}>Failed to load stats: {error}</p>;

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { setTitle } = usePageTitle(); // 2. Get the setTitle function from our context

  // --- Get Data from Redux ---
  const { stats, status, error } = useSelector((state) => state.dashboard);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // --- Data Fetching and Title Setting Effect ---
  useEffect(() => {
    // 3. Set the title for the header when this page mounts
    setTitle('Dashboard Overview');

    // Only fetch the stats if the user is authenticated and we haven't already tried.
    // This prevents API errors and unnecessary fetches.
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchDashboardStats());
    }
  }, [isAuthenticated, status, dispatch, setTitle]); // 4. Add setTitle to the dependency array

  return (
    <div>
      {/* 
        The <h1> is now removed from here. The title "Dashboard Overview" 
        will be displayed in the shared AdminHeader component. 
      */}

      {status === 'loading' || status === 'idle' ? (
        <LoadingSpinner />
      ) : status === 'failed' ? (
        <ErrorDisplay error={error} />
      ) : status === 'succeeded' ? (
        <>
          <div className={styles.grid}>
            <AdminStatCard 
                title="Total Revenue" 
                value={`R ${stats.revenue?.currentMonth || 0}`} 
                change="+0%" 
                Icon={DollarSign}
                changeType="increase"
            />
            <AdminStatCard 
                title="Total Users" 
                value={stats.totalUsers ?? 0} 
                change={`+${stats.newUsersLast7Days ?? 0} this week`} 
                Icon={Users}
                changeType="increase"
            />
            <AdminStatCard 
                title="Total Projects" 
                value={stats.totalProjects ?? 0} 
                change="+5" // Placeholder
                Icon={Briefcase}
                changeType="increase"
            />
            <AdminStatCard 
                title="Pending Requests" 
                value="3" // Placeholder
                Icon={UserPlus}
                changeType="decrease"
            />
          </div>
          
          <div className={styles.mainContent}>
            <h2>Recent Activity & Charts (Coming Soon)</h2>
            {/* Charts and activity feed components will go here */}
          </div>
        </>
      ) : null}
    </div>
  );
};