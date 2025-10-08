// src/components/billing/PricingCard.jsx
import styles from './PricingCard.module.css';
export const PricingCard = ({ title, price, selected, onSelect }) => {
  return (
    <button 
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      <span className={styles.title}>{title}</span>
      <span className={styles.price}>{price}</span>
    </button>
  );
};