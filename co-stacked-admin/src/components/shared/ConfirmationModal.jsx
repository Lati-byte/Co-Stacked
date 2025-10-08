// src/components/shared/ConfirmationModal.jsx

import { Dialog } from './Dialog'; // We will create this Dialog component next
import { Button } from '../ui/Button'; // Assuming you have a Button component
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmationModal.module.css';
import PropTypes from 'prop-types';

export const ConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm"
}) => {
  if (!open) {
    return null;
  }
  
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={32} className={styles.icon} />
        </div>
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className={styles.confirmButton} onClick={onConfirm}>
          {confirmText}
        </Button>
      </footer>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
};