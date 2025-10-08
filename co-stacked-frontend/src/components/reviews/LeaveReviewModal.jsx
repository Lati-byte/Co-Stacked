// src/components/reviews/LeaveReviewModal.jsx
import { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { Textarea } from '../shared/Textarea';
import { Star } from 'lucide-react';
import styles from './LeaveReviewModal.module.css';

export const LeaveReviewModal = ({ developer, open, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    console.log(`Submitting review for ${developer.name}:`, { rating, comment });
    alert("Review submitted successfully!");
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className={styles.title}>Leave a Review for {developer.name}</h2>
      <div className={styles.ratingInput}>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={starValue}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(starValue)}
              className={styles.starButton}
            >
              <Star
                size={28}
                className={(hoverRating || rating) >= starValue ? styles.filled : styles.empty}
              />
            </button>
          );
        })}
      </div>
      <Textarea 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience working with this developer..."
        rows={5}
      />
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit Review</Button>
      </footer>
    </Dialog>
  );
};