// src/pages/SettingsPage.jsx

import { useState } from 'react';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { RadioGroup } from '../components/shared/RadioGroup';
import { SettingsSection } from '../components/settings/SettingsSection';
import { PricingCard } from '../components/billing/PricingCard';
import { SubscriptionModal } from '../components/billing/SubscriptionModal';
import { CheckCircle } from 'lucide-react';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  // Main state for all user settings.
  // In a real app, this would be fetched from your API.
  const [settings, setSettings] = useState({
    email: 'alice.smith@example.com',
    profileVisibility: 'public',
    notificationEmails: 'essential',
    isVerified: false, // <-- Change to 'true' to test the verified state
  });

  // State to control the visibility of the subscription modal
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  // State to manage the loading status of the save button
  const [isSaving, setIsSaving] = useState(false);

  // Generic handler for form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for the main save button at the bottom of the page
  const handleSave = () => {
    setIsSaving(true);
    console.log("Saving settings:", settings);
    
    // Simulate an API call to update the settings
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

  return (
    <>
      {/* The SubscriptionModal is always in the DOM but only visible when `isSubModalOpen` is true */}
      <SubscriptionModal 
        open={isSubModalOpen}
        onClose={() => setSubModalOpen(false)}
      />

      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your account and platform preferences.</p>
        </header>

        <div className={styles.settingsContent}>
          {/* === ACCOUNT SECTION === */}
          <SettingsSection
            title="Account"
            description="Update your email address and manage your password."
          >
            <div className={styles.formGroup}>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" value={settings.email} onChange={handleChange} />
            </div>
            <Button variant="secondary">Change Password</Button>
          </SettingsSection>
          
          {/* === PROFILE VISIBILITY SECTION === */}
          <SettingsSection
            title="Profile Visibility"
            description="Control who can see your detailed profile information."
          >
            <RadioGroup
              name="profileVisibility"
              selectedValue={settings.profileVisibility}
              onChange={handleChange}
              options={[
                { value: 'public', label: 'Public (Visible to everyone)' },
                { value: 'connections-only', label: 'Connections Only (Visible to approved collaborators)' }
              ]}
            />
          </SettingsSection>

          {/* === NEW VERIFICATION SECTION === */}
          <SettingsSection
            title="Verification Status"
            description="Get a verified badge on your profile to increase trust and attract higher quality collaborators."
          >
            {settings.isVerified ? (
              // If the user IS verified, show the confirmation badge.
              <div className={styles.verifiedBadge}>
                <CheckCircle size={20} />
                <span>Your account is verified.</span>
              </div>
            ) : (
              // If the user is NOT verified, show the subscription prompt.
              <div className={styles.verificationContent}>
                <PricingCard
                  title="Verified Subscription"
                  price="R200 / month"
                  selected={true} // 'selected' style helps it stand out
                />
                <Button onClick={() => setSubModalOpen(true)}>
                  Subscribe Now
                </Button>
              </div>
            )}
          </SettingsSection>
          
          {/* === NOTIFICATIONS SECTION === */}
          <SettingsSection
            title="Email Notifications"
            description="Choose which emails you receive from CoStacked."
          >
            <div className={styles.formGroup}>
              <Label>Notification Frequency</Label>
               <RadioGroup
                name="notificationEmails"
                selectedValue={settings.notificationEmails}
                onChange={handleChange}
                options={[
                  { value: 'all', label: 'All new project and message notifications' },
                  { value: 'essential', label: 'Only essential account updates' },
                  { value: 'none', label: 'None' }
                ]}
              />
            </div>
          </SettingsSection>
        </div>

        <footer className={styles.footer}>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </footer>
      </div>
    </>
  );
};