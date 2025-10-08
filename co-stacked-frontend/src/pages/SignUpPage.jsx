// src/pages/SignUpPage.jsx
import { useState, useEffect } from 'react';
import { RegistrationForm } from '../components/auth/RegistrationForm';
import { NDAModal } from '../components/auth/NDAModal';
import styles from './SignUpPage.module.css';

export const SignUpPage = () => {
  // Logic to check if NDA has been accepted
  const [ndaAccepted, setNdaAccepted] = useState(false);
  // A state to prevent the form from showing before we check localStorage
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    // Check localStorage once when the component mounts
    const accepted = localStorage.getItem('ndaAccepted') === 'true';
    setNdaAccepted(accepted);
    setCheckedStorage(true); // Mark that we have checked
  }, []);

  const handleAcceptNda = () => {
    localStorage.setItem('ndaAccepted', 'true');
    setNdaAccepted(true);
  };
  
  // While we are checking localStorage, render nothing to avoid flicker
  if (!checkedStorage) {
    return null; 
  }

  // If we have checked storage and NDA is not accepted, show the modal
  if (!ndaAccepted) {
    return <NDAModal onAccept={handleAcceptNda} />;
  }

  // Otherwise, show the main registration page
  return (
    <div className={styles.pageContainer}>
      <RegistrationForm />
    </div>
  );
};