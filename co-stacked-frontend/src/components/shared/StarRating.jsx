// src/components/shared/StarRating.jsx

import { Star } from 'lucide-react';
import styles from './StarRating.module.css';
import PropTypes from 'prop-types';

export const StarRating = ({ rating = 0, onRatingChange, isEditable = false, size = 24 }) => {
  const handleStarClick = (index) => {
    // Only allow changing the rating if the component is editable
    if (isEditable && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={`${styles.starContainer} ${isEditable ? styles.editable : ''}`}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < rating ? styles.filled : styles.empty}
          onClick={() => handleStarClick(index)}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  onRatingChange: PropTypes.func,
  isEditable: PropTypes.bool,
  size: PropTypes.number,
};