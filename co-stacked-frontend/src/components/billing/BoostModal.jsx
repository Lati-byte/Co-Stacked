// src/components/billing/BoostModal.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
const YOCO_PUBLIC_KEY = 'pk_test_ed3c54a6gOol69qa7f45';

/**
 * A modal for boosting a project, which uses the Yoco Inline SDK.
 */
export const BoostModal = ({ project, open, onClose }) => {
  const dispatch = useDispatch();
  // Using a local loading state is best for this flow, as the global one might resolve too early.
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
    if (!yocoSDK) {
      alert("Payment gateway is not available at the moment. Please try again later.");
      return;
    }

    setIsLoading(true);
    const chosenOption = boostOptions.find(opt => opt.id === selectedTier);

    // --- THIS IS THE CRITICAL FIX for the layering (z-index) issue ---
    // 1. Immediately close our application's modal.
    onClose();
    // -------------------------------------------------------------------
    
    // 2. Now trigger the Yoco popup, which will appear over the main page.
    yocoSDK.showPopup({
      amountInCents: chosenOption.amountInCents,
      currency: 'ZAR',
      name: `Boost: ${project.title}`,
      description: `Boost project for ${chosenOption.title}`,
      callback: async (result) => {
        // This callback runs after the Yoco popup is closed by the user (payment success, failure, or closed manually).
        setIsLoading(false); // Reset loading state regardless of outcome

        if (result.error) {
          alert(`Payment failed: ${result.error.message}`);
        } else {
          // A charge token was successfully created. Send it to our backend for verification.
          const payload = { 
            chargeToken: result.id, 
            projectId: project._id, 
            tierId: selectedTier 
          };
          
          alert("Payment completed! Verifying with our server...");
          
          const resultAction = await dispatch(verifyPayment(payload));

          if (verifyPayment.fulfilled.match(resultAction)) {
              alert(resultAction.payload.message); // e.g., "Project boosted successfully!"
          } else {
              alert(`Server Verification Failed: ${resultAction.payload?.message || 'Please contact support.'}`);
          }
          // The modal is already closed, so no need to call onClose() again.
        }
      }
    });

    // In case the user just closes the Yoco popup without completing, we should reset our loading state.
    setTimeout(() => {
      if(isLoading) setIsLoading(false);
    }, 3000); // Give the popup a few seconds to appear.
  };

  if (!open || !project) {
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