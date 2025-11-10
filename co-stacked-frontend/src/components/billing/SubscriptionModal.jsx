// src/components/billing/SubscriptionModal.jsx

import { useState, useEffect } from 'react';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { CheckCircle, Loader2 } from 'lucide-react';
import styles from './SubscriptionModal.module.css';
import PropTypes from 'prop-types';

const YOCO_PUBLIC_KEY = 'pk_test_ed3c54a6gOol69qa7f45';
const PRICE_IN_CENTS = 20000; // R200.00

/**
 * A modal for handling the user verification subscription payment flow via Yoco.
 * It is a "presentational" component that orchestrates the Yoco popup and reports
 * the result back to its parent component via props.
 */
export const SubscriptionModal = ({ open, onClose, onConfirm }) => {
  // Local state to manage the button's loading status.
  const [isLoading, setIsLoading] = useState(false);
  const [yocoSDK, setYocoSDK]  = useState(null);
  
  useEffect(() => {
    if(window.YocoSDK) {
        setYocoSDK(new window.YocoSDK({ publicKey: YOCO_PUBLIC_KEY }));
    } else {
      console.error("Yoco SDK is not loaded. Ensure the script tag is in your index.html");
    }
  }, []);

  const handlePayment = () => {
    if (!yocoSDK) {
      alert("Payment service is unavailable. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    // It's good UX to close our own modal before Yoco's opens.
    onClose(); 

    yocoSDK.showPopup({
      amountInCents: PRICE_IN_CENTS,
      currency: 'ZAR',
      name: 'Co-Stacked Verified Subscription',
      description: 'Monthly subscription for a verified user badge.',
      callback: (result) => {
        // This callback runs after the Yoco popup is closed by the user.
        setIsLoading(false);

        if (result.error) {
          // If Yoco reports an error, just show an alert.
          alert(`Payment failed: ${result.error.message}`);
        } else if (result.id) {
          // On success, Yoco returns a charge token in `result.id`.
          // We call the `onConfirm` function passed from the parent (SettingsPage)
          // and pass the charge token up to it. The parent will handle the API call.
          onConfirm(result.id); 
        } else {
          // Fallback in case the user closes the popup without paying
          console.log("Yoco popup closed without a result.");
        }
      }
    });
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <header className={styles.header}>
        <CheckCircle size={40} className={styles.icon} />
        <h1 className={styles.title}>Confirm Your Subscription</h1>
        <p className={styles.subtitle}>You are about to subscribe to the Co-Stacked Verified plan.</p>
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
        <Button onClick={handlePayment} disabled={isLoading}>
          {isLoading ? (<><Loader2 className="animate-spin mr-2"/>Processing...</>) : 'Confirm & Pay'}
        </Button>
      </footer>
    </Dialog>
  );
};

SubscriptionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};