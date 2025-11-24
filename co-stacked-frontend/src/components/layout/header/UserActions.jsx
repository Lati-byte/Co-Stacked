// src/components/layout/header/UserActions.jsx
import { AnimatePresence } from 'framer-motion';
import { Button } from '../../shared/Button';
import { DropdownMenu } from '../../shared/DropdownMenu';
import { NotificationDropdown } from '../../notifications/NotificationDropdown';
import { User, Bell, Menu } from 'lucide-react';
import styles from '../Header.module.css';
import PropTypes from 'prop-types';

export const UserActions = ({
  isAuthenticated, user, notifications, isNotifOpen, setNotifOpen,
  isDropdownOpen, setDropdownOpen, notifRef, dropdownRef,
  handleLogout, handleMarkAsRead, setMobileMenuOpen,
}) => (
  <div className={styles.userActions}>
    {isAuthenticated && user?.role === 'founder' && (
      <div className={styles.postProjectButton}>
        <Button variant="primary" to="/post-project">Post Project</Button>
      </div>
    )}
    
    {isAuthenticated ? (
      <>
        <div ref={notifRef} className={styles.notificationWrapper}>
          <button className={styles.notificationButton} onClick={() => setNotifOpen(prev => !prev)} aria-label="Toggle notifications">
            <Bell size={24} />
            {notifications.length > 0 && <span className={styles.notificationCount}>{notifications.length}</span>}
          </button>
          <AnimatePresence>
            {isNotifOpen && <NotificationDropdown notifications={notifications} onMarkAsRead={handleMarkAsRead} />}
          </AnimatePresence>
        </div>
        
        <div ref={dropdownRef}>
          <button className={styles.profileLink} onClick={() => setDropdownOpen(prev => !prev)} aria-label="Toggle user menu">
            <span className={styles.userName}>{user?.name}</span>
            <User size={24} />
          </button>
          <AnimatePresence>
            {isDropdownOpen && <DropdownMenu onLogout={handleLogout} />}
          </AnimatePresence>
        </div>
      </>
    ) : (
      <div className={styles.authButtons}>
        <Button variant="secondary" to="/login">Login</Button>
        <Button variant="primary" to="/signup">Sign Up</Button>
      </div>
    )}

    <button className={styles.hamburgerButton} onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
      <Menu size={28} />
    </button>
  </div>
);

UserActions.propTypes = { /* Add PropTypes for all props */ };