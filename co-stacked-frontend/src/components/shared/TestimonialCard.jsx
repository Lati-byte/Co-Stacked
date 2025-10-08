// src/components/shared/TestimonialCard.jsx

import PropTypes from 'prop-types';
import styles from './TestimonialCard.module.css';

export const TestimonialCard = ({ quote, authorName, authorRole, avatarUrl }) => {
  return (
    <div className={styles.card}>
      {/* For now, we use a div as a placeholder for the avatar */}
      <div className={styles.avatar}>
        {/* If avatarUrl was provided, we'd use an <img /> tag here */}
      </div>

      <p className={styles.quote}>"{quote}"</p>
      
      <div className={styles.authorInfo}>
        <p className={styles.authorName}>- {authorName}</p>
        <p className={styles.authorRole}>{authorRole}</p>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  quote: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorRole: PropTypes.string.isRequired,
  // avatarUrl is optional for now
  avatarUrl: PropTypes.string,
};