// src/components/shared/FeatureCard.jsx

import PropTypes from 'prop-types';
import styles from './FeatureCard.module.css';

// The 'IconComponent' prop expects a React component (e.g., <Lightbulb />) to be passed to it.
// We give it a capitalized name to signify that it's a component.
export const FeatureCard = ({ IconComponent, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <IconComponent className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

FeatureCard.propTypes = {
  // 'elementType' is the correct prop type for passing a component as a prop.
  IconComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};