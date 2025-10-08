// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom'; // <-- THIS LINE IS NOW CORRECT
import styles from "./Footer.module.css";
import logoSrc from "../../assets/logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* === Left Side: Logo and Tagline === */}
        <div className={styles.brandSection}>
          <Link to="/" className={styles.logoContainer}>
            <img src={logoSrc} alt="CoStacked Logo" className={styles.logoImage} />
            <span className={styles.logoText}>CoStacked</span>
           </Link>
          <p className={styles.tagline}>
            Where great ideas meet great developers.
          </p>
        </div>

        {/* === Right Side: Link Columns === */}
        <div className={styles.linksSection}>
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Platform</h4>
            <Link to="/projects" className={styles.link}>Discover Projects</Link>
            <Link to="/users" className={styles.link}>Find Talent</Link>
            <Link to="/post-project" className={styles.link}>Post a Project</Link>
          </div>
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Company</h4>
            <Link to="/about" className={styles.link}>About Us</Link>
            <Link to="/support" className={styles.link}>Support</Link>
            <Link to="/blog" className={styles.link}>Blog</Link>
          </div>
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Legal</h4>
            <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link to="/terms" className={styles.link}>Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* === Bottom Bar: Copyright === */}
      <div className={styles.bottomBar}>
        <p>&copy; {currentYear} CoStacked. All Rights Reserved.</p>
      </div>
    </footer>
  );
};