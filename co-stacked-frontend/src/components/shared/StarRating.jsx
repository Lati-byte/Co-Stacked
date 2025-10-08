// src/components/shared/StarRating.jsx
import { Star } from 'lucide-react';
import styles from './StarRating.module.css';
export const StarRating = ({ rating = 0 }) => {
  return (
    <div className={styles.starContainer}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={18}
            className={starValue <= rating ? styles.filled : styles.empty}
          />
        );
      })}
    </div>
  );
};