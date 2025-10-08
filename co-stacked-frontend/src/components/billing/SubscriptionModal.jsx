// src/components/billing/SubscriptionModal.jsx
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { CheckCircle } from 'lucide-react';
import styles from './SubscriptionModal.module.css'; // We'll create a new simple CSS file

export const SubscriptionModal = ({ open, onClose }) => {
  const handlePayment = () => {
    console.log("User wants to subscribe for Verification at R200/month");
    alert("Proceeding to subscription payment...");
    // Redirect to Stripe/Paystack checkout would happen here.
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <header className={styles.header}>
        <CheckCircle size={40} className={styles.icon} />
        <h1 className={styles.title}>Confirm Your Subscription</h1>
        <p className={styles.subtitle}>You are about to subscribe to the CoStacked Verified plan.</p>
      </header>
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Plan</span>
          <strong>Verified User</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Price</span>
          <strong>R200 / month</strong>
        </div>
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handlePayment}>Confirm & Pay</Button>
      </footer>
    </Dialog>
  );
};