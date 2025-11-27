// src/pages/PaymentPage.jsx

import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyProfileBoost, verifyPayment, verifySubscription } from '../features/payments/paymentSlice';
import styles from './PaymentPage.module.css';
import { Loader2 } from 'lucide-react';

const YOCO_PUBLIC_KEY = 'pk_test_ed3c54a6gOol69qa7f45';
const YOCO_SDK_URL = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { amountInCents, currency, name, description, metadata, action } = location.state || {};
  
  const [yocoInline, setYocoInline] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  // Redirect if someone lands on this page directly
  useEffect(() => {
    if (!amountInCents) {
      navigate('/');
    }
  }, [amountInCents, navigate]);

  // Handler for what to do after Yoco gives us a token
  const processPayment = useCallback(async (token) => {
    alert("Payment token received! Verifying with our server...");
    let resultAction;

    if (action === 'profileBoost') {
      resultAction = await dispatch(verifyProfileBoost({ chargeToken: token, ...metadata }));
    } else if (action === 'projectBoost') {
      resultAction = await dispatch(verifyPayment({ chargeToken: token, ...metadata }));
    } else if (action === 'subscription') {
      resultAction = await dispatch(verifySubscription(token));
    }

    if (resultAction && resultAction.meta.requestStatus === 'fulfilled') {
      alert(resultAction.payload.message || 'Verification successful!');
      navigate(metadata.successPath || '/dashboard');
    } else {
      alert(`Server Verification Failed: ${resultAction.payload?.message || 'Please contact support.'}`);
      navigate(metadata.failurePath || '/');
    }
  }, [action, metadata, dispatch, navigate]);

  // --- THIS IS THE PROVEN SCRIPT-LOADING LOGIC ---
  useEffect(() => {
    if (!amountInCents) return; // Don't run if there's no payment info

    const script = document.createElement('script');
    script.src = YOCO_SDK_URL;
    script.async = true;
    
    script.onload = () => {
      console.log("Yoco SDK script loaded successfully.");
      if (window.YocoSDK) {
        try {
          const sdk = new window.YocoSDK({ publicKey: YOCO_PUBLIC_KEY });
          const inlineForm = sdk.inline({ 
            layout: 'card', 
            amountInCents, 
            currency: currency || 'ZAR',
            name,
            description,
          });
          inlineForm.mount('#card-frame');
          setYocoInline(inlineForm); // Save the inline form instance to state
          setIsLoadingForm(false);
          console.log("Yoco inline form mounted.");
        } catch (e) {
          console.error("Error initializing Yoco inline form:", e);
        }
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load the Yoco SDK script.");
    };

    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => { 
      const existingScript = document.querySelector(`script[src="${YOCO_SDK_URL}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [amountInCents, currency, name, description]);

  // Handler for the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!yocoInline || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await yocoInline.createToken();
      if (result.error) {
        alert('Card Error: ' + result.error.message);
        setIsSubmitting(false);
      } else {
        await processPayment(result.id);
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.amount}>
          Total: R{(amountInCents / 100).toFixed(2)}
        </div>
        
        {isLoadingForm && (
          <div className={styles.loaderContainer}>
            <Loader2 className="animate-spin" />
            <p>Loading secure payment form...</p>
          </div>
        )}
        
        <div id="card-frame" style={{ display: isLoadingForm ? 'none' : 'block' }}></div>
        
        <button type="submit" className={styles.payButton} disabled={!yocoInline || isSubmitting}>
          {isSubmitting ? 'Processing...' : `Pay R${(amountInCents / 100).toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};