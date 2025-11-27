// src/components/notifications/NotificationDropdown.jsx

import { motion } from 'framer-motion';
import { NotificationItem } from './NotificationItem'; // <-- CRITICAL FIX: Import with curly braces {}
import styles from './NotificationDropdown.module.css';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.dropdown}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.header}>
          <h3>Notifications</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.list}>
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <NotificationItem key={notif._id} notification={notif} />
            ))
          ) : (
            <p className={styles.emptyMessage}>You have no new notifications.</p>
          )}
        </div>
        {notifications.length > 0 && (
          <div className={styles.footer}>
            <button onClick={onMarkAsRead} className={styles.markReadButton}>
              Mark all as read
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

NotificationDropdown.propTypes = {
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
};

// CRITICAL FIX: This component is lazy-loaded, so it MUST be a default export.
export default NotificationDropdown;