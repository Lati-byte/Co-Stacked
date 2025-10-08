// src/components/layout/AdminHeader.jsx
import { useSelector } from 'react-redux';
import styles from './AdminHeader.module.css';
import { User, Bell, ChevronDown } from 'lucide-react';

// A simple hook to use our context later
import { usePageTitle } from '../../context/PageTitleContext';

export const AdminHeader = () => {
  const { title } = usePageTitle(); // Get the title from our context
  const { user } = useSelector(state => state.auth);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title || 'Dashboard'}</h1>
      <div className={styles.userMenu}>
        <button className={styles.notificationButton}>
          <Bell size={20} />
        </button>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <span>{(user?.name || '?').charAt(0)}</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>Administrator</span>
          </div>
          <ChevronDown size={18} />
        </div>
        {/* We can add a Dropdown here later */}
      </div>
    </header>
  );
};