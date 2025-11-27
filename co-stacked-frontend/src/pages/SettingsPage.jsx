// src/pages/SettingsPage.jsx

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import all necessary Redux Actions for this page
import { updateUserProfile, deleteAccount } from '../features/auth/authSlice';
import { verifySubscription, cancelSubscription } from '../features/payments/paymentSlice';

// Import all required UI Components
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { RadioGroup } from '../components/shared/RadioGroup';
import { SettingsSection } from '../components/settings/SettingsSection';
import { ConfirmationModal } from '../components/shared/ConfirmationModal';
import { SubscriptionModal } from '../components/billing/SubscriptionModal';
import { ChangePasswordModal } from '../components/auth/ChangePasswordModal';
import { CheckCircle } from 'lucide-react';
import styles from './SettingsPage.module.css';

/**
 * The main page for managing user account settings, preferences, and subscriptions.
 */
export const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, status: authStatus } = useSelector(state => state.auth);
  const { status: paymentStatus } = useSelector(state => state.payment);
  
  const [formData, setFormData] = useState({
    profileVisibility: '',
    notificationEmails: '',
  });
  
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation

  useEffect(() => {
    if (user) {
      setFormData({
        profileVisibility: user.profileVisibility || 'public', 
        notificationEmails: user.notificationEmails || 'essential',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = async () => {
    const resultAction = await dispatch(updateUserProfile(formData));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      alert("Settings saved successfully!");
    } else {
      alert("Failed to save settings.");
    }
  };
  
  const handleVerification = async (chargeToken) => {
    if (!chargeToken) return;
    setSubModalOpen(false);
    alert("Payment successful! Verifying your subscription...");
    const resultAction = await dispatch(verifySubscription(chargeToken));
    if (verifySubscription.fulfilled.match(resultAction)) {
      alert(resultAction.payload.message);
    } else {
      alert(`Verification Failed: ${resultAction.payload?.message || 'Please contact support.'}`);
    }
  };

  const handleCancelSubscription = async () => {
    const resultAction = await dispatch(cancelSubscription());
    if (cancelSubscription.fulfilled.match(resultAction)) {
      alert(resultAction.payload.message);
    } else {
      alert(`Cancellation failed: ${resultAction.payload?.message || 'Please contact support.'}`);
    }
    setCancelModalOpen(false);
  };

  // Handler for confirming and executing account deletion
  const handleDeleteAccount = async () => {
    const resultAction = await dispatch(deleteAccount());
    setDeleteModalOpen(false); // Close the modal immediately
    if (deleteAccount.fulfilled.match(resultAction)) {
      alert(resultAction.payload.message);
      // The logout action inside the thunk will clear the Redux state and localStorage.
      // We navigate to ensure the user is moved to a public page.
      navigate('/login');
    } else {
      alert(`Account deletion failed: ${resultAction.payload?.message || 'An unexpected error occurred.'}`);
    }
  };

  if (!user) {
    return <div style={{textAlign: 'center', padding: '4rem'}}>Loading your settings...</div>;
  }

  return (
    <>
      {/* All Modals */}
      <SubscriptionModal 
        open={isSubModalOpen}
        onClose={() => setSubModalOpen(false)}
        onConfirm={handleVerification}
      />
      <ChangePasswordModal 
        open={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
      <ConfirmationModal
        open={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your verification subscription? Your verified badge will be removed immediately."
        confirmText="Yes, Cancel Subscription"
        isDestructive={true}
      />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account"
        message="Are you absolutely sure? This action is irreversible and will permanently delete your account and all associated data from CoStacked."
        confirmText="Yes, Permanently Delete My Account"
        isDestructive={true}
      />

      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your account and platform preferences.</p>
        </header>

        <div className={styles.settingsContent}>
          <SettingsSection title="Account" description="Your account's email address.">
            <div className={styles.formGroup}>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" value={user.email} disabled />
            </div>
            <Button variant="secondary" onClick={() => setPasswordModalOpen(true)}>
              Change Password
            </Button>
          </SettingsSection>
          
          <SettingsSection title="Profile Visibility" description="Control who sees your profile.">
            <RadioGroup name="profileVisibility" selectedValue={formData.profileVisibility} onChange={handleChange}
              options={[{ value: 'public', label: 'Public' }, { value: 'connections-only', label: 'Connections Only' }]}/>
          </SettingsSection>
          
          <SettingsSection title="Verification Status" description="Get a verified badge on your profile.">
            {user.isVerified ? (
              <div className={styles.verifiedContainer}>
                <div className={styles.verifiedBadge}>
                  <CheckCircle size={20} /><span>Your account is verified.</span>
                </div>
                <Button variant="destructive" onClick={() => setCancelModalOpen(true)} disabled={paymentStatus === 'loading'}>
                  {paymentStatus === 'loading' ? 'Canceling...' : 'Cancel Subscription'}
                </Button>
              </div>
            ) : (
              <div className={styles.verificationContent}>
                <p>Subscribe to get a verified badge and priority support.</p>
                <Button onClick={() => setSubModalOpen(true)}>Subscribe Now (R200/month)</Button>
              </div>
            )}
          </SettingsSection>
          
          <SettingsSection title="Email Notifications" description="Choose which emails you receive.">
            <RadioGroup name="notificationEmails" selectedValue={formData.notificationEmails} onChange={handleChange}
              options={[{ value: 'all', label: 'All notifications' }, { value: 'essential', label: 'Only essential updates' }, { value: 'none', label: 'None' }]}/>
          </SettingsSection>
          
          {/* New "Danger Zone" section for account deletion */}
          <SettingsSection 
            title="Danger Zone" 
            description="These actions are permanent and cannot be undone."
            isDangerZone={true}
          >
            <Button variant="destructive" onClick={() => setDeleteModalOpen(true)} disabled={authStatus === 'loading'}>
              {authStatus === 'loading' && isDeleteModalOpen ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </SettingsSection>
        </div>

        <footer className={styles.footer}>
          <Button onClick={handleSave} disabled={authStatus === 'loading'}>
            {authStatus === 'loading' ? 'Saving...' : 'Save Changes'}
          </Button>
        </footer>
      </div>
    </>
  );
};