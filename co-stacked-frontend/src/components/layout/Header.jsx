// src/components/layout/Header.jsx

import { useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

// Import the logout action from your auth slice
import { logout } from '../../features/auth/authSlice';

// Import components and assets
import { Button } from '../shared/Button';
import { DropdownMenu } from '../shared/DropdownMenu';
import { useClickOutside } from '../../hooks/useClickOutside';
import { User } from 'lucide-react';
import logoSrc from '../../assets/logo.png';
import styles from './Header.module.css';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Get the LIVE authentication state from the Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Local state for controlling the dropdown menu UI
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hook to close the dropdown when clicking outside of it
  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  
  // Handler for the logout action
  const handleLogout = () => {
      dispatch(logout());
      setDropdownOpen(false); // Close the dropdown menu
      navigate('/login'); // Redirect the user to the login page
  };
  
  // Navigation links are now built dynamically based on the live 'isAuthenticated' state
  const navigationLinks = [
    { label: 'Discover', path: '/projects' },
    { label: 'Find Talent', path: '/users' },
    ...(isAuthenticated ? [{ label: 'Messages', path: '/messages' }] : [])
  ];

  return (
    <header className={styles.header}>
      {/* ===== LEFT SECTION: LOGO ===== */}
      <div className={styles.leftSection}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logoSrc} alt="CoStacked Logo" className={styles.logoImage} />
          <span className={styles.logoText}>CoStacked</span>
        </Link>
      </div>

      {/* ===== MIDDLE SECTION: NAVIGATION LINKS ===== */}
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
      <div className={styles.userActions} ref={dropdownRef}>
        {isAuthenticated && user?.role === 'founder' && (
          <Button variant="primary" to="/post-project">
            Post Project
          </Button>
        )}
        
        {isAuthenticated ? (
          // If the user IS authenticated, show the profile icon and dropdown
          <>
            <button 
              className={styles.profileLink} 
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-label="Toggle user menu"
            >
              {/* You could eventually show a real avatar here */}
              <User size={24} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && <DropdownMenu onLogout={handleLogout} />}
            </AnimatePresence>
          </>
        ) : (
          // If the user is NOT authenticated, show Login and Sign Up buttons
          <div className={styles.authButtons}>
            <Button variant="secondary" to="/login">Login</Button>
            <Button variant="primary" to="/signup">Sign Up</Button>
          </div>
        )}
      </div>
    </header>
  );
};