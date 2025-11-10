// src/components/layout/Header.jsx

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

// Import Redux actions
import { logout } from '../../features/auth/authSlice';
import { fetchNotifications, markNotificationsAsRead } from '../../features/notifications/notificationsSlice';

// Import components and assets
import { Button } from '../shared/Button';
import { DropdownMenu } from '../shared/DropdownMenu';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { useClickOutside } from '../../hooks/useClickOutside';
import { User, Bell, Menu, X } from 'lucide-react';
import logoSrc from '../../assets/logo.png';
import styles from './Header.module.css';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector(state => state.notifications);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);
  
  useEffect(() => {
    setDropdownOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (isMobileMenuOpen || isNotifOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen, isNotifOpen]);

  const handleLogout = () => {
      dispatch(logout());
      setDropdownOpen(false);
      navigate('/login');
  };

  /**
   * This function ONLY closes the notification modal without changing data.
   * It's used for the 'X' button and the backdrop click.
   */
  const handleCloseNotifications = () => {
    setNotifOpen(false);
  };
  
  /**
   * This function performs the primary action: marking notifications as read
   * AND then closing the modal.
   */
  const handleMarkAsRead = () => {
    if (notifications.length > 0) {
      dispatch(markNotificationsAsRead());
    }
    setNotifOpen(false); // Close the modal after the action
  };
  
  const navigationLinks = [
    { label: 'Discover', path: '/projects' },
    { label: 'Find Talent', path: '/users' },
    ...(isAuthenticated ? [{ label: 'Messages', path: '/messages' }] : [])
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logoContainer}>
            <img src={logoSrc} alt="CoStacked Logo" className={styles.logoImage} />
            <span className={styles.logoText}>CoStacked</span>
          </Link>
        </div>

        <nav className={styles.navLinks}>
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userActions}>
          {isAuthenticated && user?.role === 'founder' && (
            <div className={styles.desktopPostProject}>
              <Button variant="primary" to="/post-project">
                Post Project
              </Button>
            </div>
          )}
          
          {isAuthenticated ? (
            <>
              <div ref={notifRef} className={styles.notificationWrapper}>
                <button className={styles.notificationButton} onClick={() => setNotifOpen(prev => !prev)} aria-label="Toggle notifications">
                  <Bell size={24} />
                  {notifications.length > 0 && (
                    <span className={styles.notificationCount}>{notifications.length}</span>
                  )}
                </button>
                <AnimatePresence>
                  {isNotifOpen && 
                    <NotificationDropdown 
                      notifications={notifications} 
                      onClose={handleCloseNotifications}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  }
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

          <button 
            className={styles.hamburgerMenu} 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Navigation</span>
              <button 
                className={styles.closeMenuButton} 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className={styles.mobileLinksContainer}>
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    isActive ? `${styles.mobileNavLink} ${styles.activeMobileLink}` : styles.mobileNavLink
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className={styles.mobileActionsContainer}>
              {isAuthenticated && user?.role === 'founder' && (
                <Button variant="primary" to="/post-project" fullWidth>
                  Post Project
                </Button>
              )}
              {!isAuthenticated && (
                <>
                  <Button variant="secondary" to="/login" fullWidth>Login</Button>
                  <Button variant="primary" to="/signup" fullWidth>Sign Up</Button>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};