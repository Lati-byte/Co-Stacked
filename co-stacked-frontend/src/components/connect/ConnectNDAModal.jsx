// src/components/connect/ConnectNDAModal.jsx
import { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { Label } from '../shared/Label';
import styles from './ConnectNDAModal.module.css';

export const ConnectNDAModal = ({ open, onClose, onConfirm }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <header className={styles.header}>
        <h1 className={styles.title}>Non-Disclosure Agreement (NDA)</h1>
        <p className={styles.description}>Please review and acknowledge before expressing interest.</p>
      </header>
      <div className={styles.content}>
        <p>By proceeding, you agree to keep confidential any proprietary information shared with you regarding this project...</p>
        <strong>Key Terms:</strong>
        <ul>
          <li>Confidentiality of shared information.</li>
          <li>Non-use of information outside of collaboration.</li>
        </ul>
        <p className={styles.mockNotice}>This is a mock agreement for demonstration purposes.</p>
      </div>
      <div className={styles.checkboxWrapper}>
        <input type="checkbox" id="nda-agree" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
        <Label htmlFor="nda-agree">I acknowledge and agree to the terms of this NDA.</Label>
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} disabled={!isChecked}>Agree and Connect</Button>
      </footer>
    </Dialog>
  );
};