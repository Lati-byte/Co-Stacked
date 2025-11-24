// src/components/layout/Header.jsx

import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

// Import Hooks and Actions
import { useTheme } from '../../context/ThemeContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { logout } from '../../features/auth/authSlice';
import { fetchNotifications, markNotificationsAsRead } from '../../features/notifications/notificationsSlice';

// Import Logos
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

// Import the new Sub-Components
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNav } from './header/DesktopNav';
import { UserActions } from './header/UserActions';
import { MobileMenu } from './header/MobileMenu';
import styles from './Header.module.css';

// Dynamically import dropdowns to prevent build errors and for performance.
const NotificationDropdown = lazy(() => import('../notifications/NotificationDropdown'));
const DropdownMenu = lazy(() => import('../shared/DropdownMenu'));

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  // State from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector(state => state.notifications);

  // Local UI State
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  
  // Handlers and Effects
  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  useEffect(() => { if (isAuthenticated) dispatch(fetchNotifications()); }, [isAuthenticated, dispatch]);
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => { document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto'; return () => { document.body.style.overflow = 'auto'; }; }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleMarkAsRead = () => {
    if (notifications.length > 0) dispatch(markNotificationsAsRead());
    setNotifOpen(false);
  };
  
  // Data to pass down to child components
  const navigationLinks = [
    { label: 'Discover', path: '/projects' },
    { label: 'Find Talent', path: '/users' },
    ...(isAuthenticated ? [{ label: 'Messages', path: '/messages' }] : [])
  ];
  const logoSrc = theme === 'light' ? logoLight : logoDark;

  return (
    <>
      <header className={styles.header}>
        <HeaderLogo logoSrc={logoSrc} />
        <DesktopNav links={navigationLinks} />
        {/* Suspense is a fallback for if the lazy-loaded components are not ready yet */}
        <Suspense fallback={<div style={{ width: '150px' }} />}>
          <UserActions 
            isAuthenticated={isAuthenticated}
            user={user}
            notifications={notifications}
            isNotifOpen={isNotifOpen}
            setNotifOpen={setNotifOpen}
            isDropdownOpen={isDropdownOpen}
            setDropdownOpen={setDropdownOpen}
            notifRef={notifRef}
            dropdownRef={dropdownRef}
            handleLogout={handleLogout}
            handleMarkAsRead={handleMarkAsRead}
            setMobileMenuOpen={setMobileMenuOpen}
            // Pass the lazy-loaded components as props
            NotificationDropdownComponent={NotificationDropdown}
            DropdownMenuComponent={DropdownMenu}
          />
        </Suspense>
      </header>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu 
            onClose={() => setMobileMenuOpen(false)}
            links={navigationLinks}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </>
  );
};