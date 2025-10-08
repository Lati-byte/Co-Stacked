// src/components/shared/DropdownMenu.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from './DropdownMenu.module.css';

// Framer Motion variants for a subtle scale/opacity animation
const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: { duration: 0.1, ease: 'easeOut' }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};

/**
 * A presentational component for the user profile dropdown menu.
 * It receives an onLogout function from its parent to handle the logout action.
 */
export const DropdownMenu = ({ onLogout }) => {
  return (
    <motion.div
      className={styles.menu}
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className={styles.title}>My Account</div>
      <Link to="/dashboard" className={styles.item}>Dashboard</Link>
      <Link to="/profile" className={styles.item}>Profile</Link>
      <Link to="/messages" className={styles.item}>Messages</Link>
      <div className={styles.separator} />
      <Link to="/settings" className={styles.item}>Settings</Link>
      <Link to="/support" className={styles.item}>Support</Link>
      <div className={styles.separator} />
      <button onClick={onLogout} className={styles.item}>
        Logout
      </button>
    </motion.div>
  );
};

// Add prop validation for the onLogout function
DropdownMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};