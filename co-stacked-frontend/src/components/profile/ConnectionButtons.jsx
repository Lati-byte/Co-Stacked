// src/components/profile/ConnectionButtons.jsx

import { Button } from '../shared/Button';
import styles from '../../pages/ProfilePage.module.css';
import PropTypes from 'prop-types';

export const ConnectionButtons = ({ status, onConnect, onCancel, onRemove, onAccept, onDecline, isLoading }) => {
  switch (status) {
    case 'connected':
      return (
        <div className={styles.connectionActions}>
          <Button disabled variant="secondary">Connected ✓</Button>
          <Button onClick={onRemove} variant="outline" disabled={isLoading}>Remove</Button>
        </div>
      );
    
    case 'pending_sent':
      return (
        <div className={styles.connectionActions}>
          <Button disabled variant="secondary">Request Sent</Button>
          <Button onClick={onCancel} variant="outline" disabled={isLoading}>Cancel</Button>
        </div>
      );
    
    case 'pending_received':
      return (
        <div className={styles.connectionActions}>
          <Button onClick={onAccept} variant="primary" disabled={isLoading}>Accept</Button>
          <Button onClick={onDecline} variant="outline" disabled={isLoading}>Decline</Button>
        </div>
      );
    
    default: // not_connected
      return (
        <Button onClick={onConnect} variant="primary" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Connect'}
        </Button>
      );
  }
};

ConnectionButtons.propTypes = { /* Add PropTypes for all props */ };