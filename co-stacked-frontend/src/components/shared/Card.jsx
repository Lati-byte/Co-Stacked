// src/components/shared/Card.jsx
import PropTypes from 'prop-types';
import styles from './Card.module.css';

export const Card = ({ children, className = '', isInteractive = false }) => {

  const cardClasses = `
    ${styles.card} 
    ${isInteractive ? styles.interactive : ''}
    ${className}
  `;

  return (
    <div className={cardClasses.trim()}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isInteractive: PropTypes.bool, // Prop to enable the hover effect
};