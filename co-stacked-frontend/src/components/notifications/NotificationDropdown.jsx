// src/components/notifications/NotificationDropdown.jsx

import { motion } from 'framer-motion';
import { NotificationItem } from './NotificationItem';
import styles from './NotificationDropdown.module.css';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * A dropdown/modal for displaying notifications.
 * Accepts two separate functions for closing vs. taking action.
 * @param {function} onClose - Function to only close the modal.
 * @param {function} onMarkAsRead - Function to mark notifications as read and then close.
 */
export const NotificationDropdown = ({ notifications, onClose, onMarkAsRead }) => {
  return (
    // The backdrop overlay now correctly calls the `onClose` function
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        // This is the modal content window
        className={styles.dropdown}
        // Prevents clicks inside the modal from bubbling up and closing it
        onClick={(e) => e.stopPropagation()} 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.header}>
          <h3>Notifications</h3>
          {/* The explicit 'X' button also calls the `onClose` function */}
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
        {/* The footer action button is the only one that calls `onMarkAsRead` */}
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

// PropTypes are updated to include the new required `onClose` function
NotificationDropdown.propTypes = {
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
};