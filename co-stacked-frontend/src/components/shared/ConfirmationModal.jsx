// src/components/shared/ConfirmationModal.jsx
import { Dialog } from './Dialog';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

export const ConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm"
}) => {
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
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button className={styles.confirmButton} onClick={onConfirm}>
          {confirmText}
        </Button>
      </footer>
    </Dialog>
  );
};