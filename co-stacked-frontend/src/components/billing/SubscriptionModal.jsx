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
 */
export const SubscriptionModal = ({ open, onClose, onConfirm }) => {
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
    if (!yocoSDK || isLoading) {
      alert("Payment service is unavailable or already processing.");
      return;
    }
    
    setIsLoading(true);

    // --- THIS IS THE CRITICAL FIX ---
    // 1. Close our application's modal first to avoid any z-index conflicts.
    onClose(); 

    // 2. A moment later, trigger the Yoco popup.
    setTimeout(() => {
      yocoSDK.showPopup({
        amountInCents: PRICE_IN_CENTS,
        currency: 'ZAR',
        name: 'Co-Stacked Verified Subscription',
        description: 'Monthly subscription for a verified user badge.',
        callback: (result) => {
          setIsLoading(false); // Reset loading state for next time

          if (result.error) {
            alert(`Payment failed: ${result.error.message}`);
          } else if (result.id) {
            // On success, pass the charge token up to the parent component (SettingsPage).
            onConfirm(result.id); 
          }
        }
      });
    }, 200);
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