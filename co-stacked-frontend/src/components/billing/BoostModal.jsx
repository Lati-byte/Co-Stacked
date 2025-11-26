// src/components/billing/BoostModal.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyPayment } from '../../features/payments/paymentSlice';

// Import UI Components
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { PricingCard } from './PricingCard';
import styles from './BoostModal.module.css';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';


const boostOptions = [
  { id: '3d', title: '3 Days', price: 'R100', amountInCents: 10000 },
  { id: '5d', title: '5 Days', price: 'R200', amountInCents: 20000 },
  { id: '7d', title: '1 Week', price: 'R350', amountInCents: 35000 },
];
const YOCO_PUBLIC_KEY = 'pk_test_ed3c54a6gOol69qa7f45'; // Use your actual public key

/**
 * A modal for boosting a project, which uses the Yoco Inline SDK.
 */
export const BoostModal = ({ project, open, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(boostOptions[0].id);
  const [yocoSDK, setYocoSDK] = useState(null);

  useEffect(() => {
    if (window.YocoSDK) {
      setYocoSDK(new window.YocoSDK({ publicKey: YOCO_PUBLIC_KEY }));
    } else {
      console.error("Yoco SDK not loaded. Make sure the script is in your index.html.");
    }
  }, []);

  const handlePayment = () => {
    if (!yocoSDK || isLoading) {
      alert("Payment gateway is not available or is already processing.");
      return;
    }

    setIsLoading(true);
    const chosenOption = boostOptions.find(opt => opt.id === selectedTier);

    // --- THIS IS THE CRITICAL FIX ---
    // 1. Close our application's modal immediately to prevent z-index conflicts.
    onClose();
    
    // 2. A moment later, trigger the Yoco popup. This allows our modal's
    //    closing animation to finish and ensures the Yoco popup appears
    //    on top of the main page, not hidden behind our modal's backdrop.
    setTimeout(() => {
      yocoSDK.showPopup({
        amountInCents: chosenOption.amountInCents,
        currency: 'ZAR',
        name: `Boost: ${project.title}`,
        description: `Boost project for ${chosenOption.title}`,
        callback: async (result) => {
          // This callback runs after the Yoco popup is closed.
          setIsLoading(false); // Reset loading state for the next time the modal opens.

          if (result.error) {
            alert(`Payment failed: ${result.error.message}`);
          } else if (result.id) {
            // Payment succeeded, now verify with our backend.
            const payload = { 
              chargeToken: result.id, 
              projectId: project._id, 
              tierId: selectedTier 
            };
            
            alert("Payment completed! Verifying with our server...");
            const resultAction = await dispatch(verifyPayment(payload));

            if (verifyPayment.fulfilled.match(resultAction)) {
                alert(resultAction.payload.message);
            } else {
                alert(`Server Verification Failed: ${resultAction.payload?.message || 'Please contact support.'}`);
            }
          }
          // If the user just closes the popup, nothing happens.
        }
      });
    }, 200); // A 200ms delay is usually sufficient for animations.
  };

  // Do not render the Dialog if it's not supposed to be open.
  if (!open) {
    return null;
  }

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
        <Button onClick={handlePayment} disabled={isLoading}>
          {isLoading ? (<><Loader2 className="animate-spin mr-2" />Processing...</>) : 'Proceed to Payment'}
        </Button>
      </footer>
    </Dialog>
  );
};

BoostModal.propTypes = {
  project: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};