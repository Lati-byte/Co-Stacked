// src/components/billing/ProfileBoostModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyProfileBoost } from '../../features/payments/paymentSlice';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { PricingCard } from './PricingCard';
import styles from './BoostModal.module.css'; // Reusing styles is efficient
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';


const boostOptions = [
  { id: '3d', title: '3 Days', price: 'R100', amountInCents: 10000 },
  { id: '5d', title: '5 Days', price: 'R250', amountInCents: 25000 },
  { id: '7d', title: '1 Week', price: 'R350', amountInCents: 35000 },
];
const YOCO_PUBLIC_KEY = 'pk_test_ed3c54a6gOol69qa7f45';

/**
 * A modal for boosting a user's profile, which initiates a Yoco payment flow.
 */
export const ProfileBoostModal = ({ user, open, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(boostOptions[0].id);
  const [yocoSDK, setYocoSDK] = useState(null);

  useEffect(() => {
    if (window.YocoSDK) {
      setYocoSDK(new window.YocoSDK({ publicKey: YOCO_PUBLIC_KEY }));
    } else {
      console.error("Yoco SDK not loaded. Ensure the script is in your index.html.");
    }
  }, []);

  const handlePayment = () => {
    if (!yocoSDK) {
      alert("Payment gateway is currently unavailable.");
      return;
    }

    setIsLoading(true);
    const chosenOption = boostOptions.find(opt => opt.id === selectedTier);

    // Close our modal before opening Yoco's to prevent layering issues
    onClose(); 

    yocoSDK.showPopup({
      amountInCents: chosenOption.amountInCents,
      currency: 'ZAR',
      name: 'Boost Your Profile',
      description: `Feature your profile for ${chosenOption.title}`,
      callback: async (result) => {
        setIsLoading(false);
        if (result.error) {
          alert(`Payment failed: ${result.error.message}`);
        } else {
          // Send the charge token to our backend for secure verification
          alert("Payment completed! Verifying boost with our server...");
          const resultAction = await dispatch(verifyProfileBoost({ 
            chargeToken: result.id, 
            tierId: selectedTier 
          }));

          if (verifyProfileBoost.fulfilled.match(resultAction)) {
            alert(resultAction.payload.message); // Show success message from backend
          } else {
            alert(`Verification Failed: ${resultAction.payload?.message || 'Please contact support.'}`);
          }
        }
      }
    });

    // Reset loading state after a delay in case user closes the popup
    setTimeout(() => {
        if(isLoading) setIsLoading(false);
    }, 3000);
  };

  if (!open || !user) {
    return null;
  }

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
        <Button onClick={handlePayment} disabled={isLoading}>
          {isLoading ? (<><Loader2 className="animate-spin mr-2" />Processing...</>) : 'Proceed to Payment'}
        </Button>
      </footer>
    </Dialog>
  );
};

ProfileBoostModal.propTypes = {
  user: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};