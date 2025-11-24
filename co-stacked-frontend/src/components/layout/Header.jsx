// src/components/layout/Header.jsx

import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

// Import Redux actions
import { logout } from '../../features/auth/authSlice';
import { fetchNotifications, markNotificationsAsRead } from '../../features/notifications/notificationsSlice';

// Import components and hooks
import { Button } from '../shared/Button';
import { DropdownMenu } from '../shared/DropdownMenu';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useTheme } from '../../context/ThemeContext';

// Import assets
import { User, Bell, Menu, X } from 'lucide-react';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import styles from './Header.module.css';

// Dynamically import the NotificationDropdown to break circular dependencies for production builds
const NotificationDropdown = lazy(() => import('../notifications/NotificationDropdown'));

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get state from Redux and Context
  const { theme } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector(state => state.notifications);

  // State for UI toggles
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for click-outside hooks
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  
  // Fetch notifications when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);
  
  // Close all menus when the user navigates to a new page
  useEffect(() => {
    setDropdownOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handler for logging out
  const handleLogout = () => {
      dispatch(logout());
      setDropdownOpen(false);
      navigate('/login');
  };

  // Handler for marking notifications as read
  const handleMarkAsRead = () => {
    if (notifications.length > 0) {
      dispatch(markNotificationsAsRead());
    }
    setNotifOpen(false);
  };
  
  // Define navigation links, conditionally showing 'Messages'
  const navigationLinks = [
    { label: 'Discover', path: '/projects' },
    { label: 'Find Talent', path: '/users' },
    ...(isAuthenticated ? [{ label: 'Messages', path: '/messages' }] : [])
  ];

  // Select the correct logo based on the current theme
  const logoSrc = theme === 'light' ? logoLight : logoDark;

  return (
    <>
      <header className={styles.header}>
        {/* ===== LEFT SECTION: LOGO ===== */}
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logoContainer}>
            <img src={logoSrc} alt="CoStacked Logo" className={styles.logoImage} />
            <span className={styles.logoText}>CoStacked</span>
          </Link>
        </div>

        {/* ===== MIDDLE SECTION: DESKTOP NAVIGATION ===== */}
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

        {/* ===== RIGHT SECTION: USER ACTIONS ===== */}
        <div className={styles.userActions}>
          {isAuthenticated && user?.role === 'founder' && (
            <div className={styles.postProjectButton}>
              <Button variant="primary" to="/post-project">Post Project</Button>
            </div>
          )}
          
          {isAuthenticated ? (
            <>
              {/* --- Notification Bell --- */}
              <div ref={notifRef} className={styles.notificationWrapper}>
                <button className={styles.notificationButton} onClick={() => setNotifOpen(prev => !prev)} aria-label="Toggle notifications">
                  <Bell size={24} />
                  {notifications.length > 0 && (
                    <span className={styles.notificationCount}>{notifications.length}</span>
                  )}
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <Suspense fallback={<div className={styles.dropdownLoading}>Loading...</div>}>
                      <NotificationDropdown notifications={notifications} onMarkAsRead={handleMarkAsRead} />
                    </Suspense>
                  )}
                </AnimatePresence>
              </div>
              
              {/* --- Profile Dropdown --- */}
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

          {/* --- Hamburger Menu Icon --- */}
          <button className={styles.hamburgerButton} onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            <Menu size={28} />
          </button>
        </div>
      </header>
      
      {/* ===== MOBILE MENU OVERLAY ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenuOverlay}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className={styles.closeButton}>
                <X size={28} />
              </button>
            </div>
            <nav className={styles.mobileNavLinks}>
              {navigationLinks.map(link => (
                <NavLink key={link.path} to={link.path} className={styles.mobileNavLink}>{link.label}</NavLink>
              ))}
            </nav>
            <div className={styles.mobileMenuFooter}>
              {isAuthenticated ? (
                <Button variant="secondary" onClick={handleLogout} fullWidth>Logout</Button>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Button variant="secondary" to="/login" fullWidth>Login</Button>
                  <Button variant="primary" to="/signup" fullWidth>Sign Up</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};