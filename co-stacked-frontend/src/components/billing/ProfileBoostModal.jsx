// src/components/billing/ProfileBoostModal.jsx
import { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { PricingCard } from './PricingCard';
import styles from './BoostModal.module.css'; // We can reuse the same CSS!

const boostOptions = [
  { id: '3d', title: '3 Days', price: 'R100' },
  { id: '5d', title: '5 Days', price: 'R250' }, // Different price as specified
  { id: '7d', title: '1 Week', price: 'R350' },
];

export const ProfileBoostModal = ({ user, open, onClose }) => {
  const [selectedTier, setSelectedTier] = useState(boostOptions[0].id);

  const handlePayment = () => {
    const chosenOption = boostOptions.find(opt => opt.id === selectedTier);
    console.log(`User wants to boost their profile for ${chosenOption.title} at ${chosenOption.price}`);
    alert(`Proceeding to payment for ${chosenOption.price}`);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <header className={styles.header}>
        <h1 className={styles.title}>Boost Your Profile</h1>
        <p className={styles.subtitle}>Feature your profile on the "Find Talent" page to get noticed by founders.</p>
      </header>
      <div className={styles.tiers}>
        {boostOptions.map(option => (
          <PricingCard
            key={option.id}
            title={option.title}
            price={option.price}
            selected={selectedTier === option.id}
            onSelect={() => setSelectedTier(option.id)}
          />
        ))}
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handlePayment}>Proceed to Payment</Button>
      </footer>
    </Dialog>
  );
};