// src/components/shared/Tag.jsx
import PropTypes from 'prop-types';
import styles from './Tag.module.css';

export const Tag = ({ children, className = '' }) => {
  const tagClasses = `${styles.tag} ${className}`;

  return (
    <span className={tagClasses}>
      {children}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};