// src/components/layout/MainLayout.jsx

import PropTypes from 'prop-types';
import { Header } from './Header';
import { Footer } from './Footer'; // 1. Import the Footer
import styles from './MainLayout.module.css'; // Let's add a style file

export const MainLayout = ({ children }) => {
  return (
    // Add a wrapper div for better styling control
    <div className={styles.layoutWrapper}> 
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer /> {/* 2. Add the Footer here */}
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};