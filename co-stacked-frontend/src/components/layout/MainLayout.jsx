// src/components/layout/MainLayout.jsx

import PropTypes from 'prop-types';
import { Header } from './Header';
import { Footer } from './Footer'; // 1. Import the Footer
import ScrollToTop from '../../utils/ScrollToTop';
import styles from './MainLayout.module.css'; // Let's add a style file

export const MainLayout = ({ children }) => {
  return (
    <div className={styles.layoutWrapper}>
      <ScrollToTop /> {/* <-- 2. RENDER THE COMPONENT HERE */}
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};