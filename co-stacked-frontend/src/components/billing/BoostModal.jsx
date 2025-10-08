// src/components/billing/BoostModal.jsx
import { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { PricingCard } from './PricingCard';
import styles from './BoostModal.module.css';

const boostOptions = [
  { id: '3d', title: '3 Days', price: 'R100' },
  { id: '5d', title: '5 Days', price: 'R200' },
  { id: '7d', title: '1 Week', price: 'R350' },
];

export const BoostModal = ({ project, open, onClose }) => {
  const [selectedTier, setSelectedTier] = useState(boostOptions[0].id);

  const handlePayment = () => {
    const chosenOption = boostOptions.find(opt => opt.id === selectedTier);
    console.log(`User wants to boost project "${project.title}" for ${chosenOption.title} at ${chosenOption.price}`);
    alert(`Proceeding to payment for ${chosenOption.price}`);
    // Here, you would redirect to a Stripe Checkout page or similar.
    onClose();
  };

  if (!project) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <header className={styles.header}>
        <h1 className={styles.title}>Boost Your Project</h1>
        <p className={styles.subtitle}>Feature "<strong>{project.title}</strong>" on the Discover page to attract more talent.</p>
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