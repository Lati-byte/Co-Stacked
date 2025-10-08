// src/components/reviews/ReviewCard.jsx
import styles from './ReviewCard.module.css';
import { Card } from '../shared/Card';
import { Avatar } from '../shared/Avatar';
import { StarRating } from '../shared/StarRating';
import { allUsers } from '../../data/mock.js';
import { format } from 'date-fns';

export const ReviewCard = ({ review }) => {
  const founder = allUsers.find(u => u.id === review.founderId);
  if (!founder) return null;

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <Avatar src={founder.avatarUrl} fallback={founder.name.charAt(0)} alt={founder.name} />
        <div>
          <p className={styles.founderName}>{founder.name}</p>
          <p className={styles.role}>Founder</p>
        </div>
        <div className={styles.rating}>
          <StarRating rating={review.rating} />
        </div>
      </header>
      <p className={styles.comment}>{review.comment}</p>
      <footer className={styles.footer}>
        {format(new Date(review.timestamp), 'MMMM d, yyyy')}
      </footer>
    </Card>
  );
};