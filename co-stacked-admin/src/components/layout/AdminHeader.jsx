// src/components/layout/AdminHeader.jsx

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePageTitle } from '../../context/PageTitleContext';
import { AdminNotificationDropdown } from '../notifications/AdminNotificationDropdown';
import { fetchAdminNotifications, markAdminNotificationsAsRead } from '../../features/notifications/adminNotificationsSlice';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './AdminHeader.module.css';
import { Bell, ChevronDown } from 'lucide-react';

export const AdminHeader = () => {
  const { title } = usePageTitle();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items: notifications } = useSelector(state => state.adminNotifications);

  const [isNotifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // This hook closes the notification dropdown when clicking outside of it.
  useClickOutside(notifRef, () => {
    if (isNotifOpen) {
      setNotifOpen(false);
    }
  });

  // Fetch notifications when the user is authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAdminNotifications());
    }
  }, [isAuthenticated, dispatch]);

  const handleMarkAsRead = () => {
    if (notifications.length > 0) {
      dispatch(markAdminNotificationsAsRead());
    }
    setNotifOpen(false);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title || 'Dashboard'}</h1>
      <div className={styles.userMenu}>
        <div ref={notifRef} className={styles.notificationWrapper}>
          <button className={styles.notificationButton} onClick={() => setNotifOpen(prev => !prev)}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={styles.notificationCount}>{notifications.length}</span>
            )}
          </button>
          {isNotifOpen && (
            <AdminNotificationDropdown 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          )}
        </div>

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
      </div>
    </header>
  );
};