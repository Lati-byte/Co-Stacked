// src/components/notifications/AdminNotificationDropdown.jsx

import { Link } from 'react-router-dom';
import styles from './AdminNotificationDropdown.module.css';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion'; // Import motion for animations
import {
  Users,
  Briefcase,
  AlertTriangle,
  CreditCard,
  X // Import X icon for the close button
} from 'lucide-react';

const getIconForType = (type) => {
  // ... (getIconForType function remains the same)
  switch (type) {
    case 'NEW_USER_REGISTERED': return <Users size={18} />;
    case 'NEW_PROJECT_POSTED': return <Briefcase size={18} />;
    case 'NEW_REPORT_SUBMITTED': return <AlertTriangle size={18} />;
    case 'PAYMENT_SUCCESS': return <CreditCard size={18} />;
    default: return null;
  }
};

// --- MODIFIED: Accept both `onClose` and `onMarkAsRead` props ---
export const AdminNotificationDropdown = ({ notifications, onClose, onMarkAsRead }) => {
  return (
    // The backdrop overlay calls the `onClose` function
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.dropdown}
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside from closing the modal
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.header}>
          <h3>Notifications</h3>
          {/* Add a dedicated close button for mobile/modal view */}
          <button onClick={onClose} className={styles.closeButton} aria-label="Close notifications">
            <X size={20} />
          </button>
        </div>
        <div className={styles.list}>
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <Link to={notif.link} key={notif._id} className={styles.notificationItem}>
                <div className={styles.iconWrapper}>
                  {getIconForType(notif.type)}
                </div>
                <p className={styles.message}>{notif.message}</p>
              </Link>
            ))
          ) : (
            <p className={styles.emptyMessage}>No new notifications.</p>
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

// --- MODIFIED: Update PropTypes to include the new required function ---
AdminNotificationDropdown.propTypes = {
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
};