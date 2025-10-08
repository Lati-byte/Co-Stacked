// src/components/auth/NDAModal.jsx
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import styles from './NDAModal.module.css';

export const NDAModal = ({ onAccept }) => {
  return (
    // We pass `open={true}` because this component being rendered means the modal should be visible.
    <Dialog open={true}>
      <header className={styles.header}>
        <h1 className={styles.title}>Non-Disclosure Agreement (NDA)</h1>
        <p className={styles.description}>Please review and accept the terms to proceed with registration.</p>
      </header>
      <div className={styles.content}>
        <p>
          This Non-Disclosure Agreement (the "Agreement") is made and entered into by and between CoStacked ("Company") and you ("Recipient").
        </p>
        <p>
          <strong>1. Confidential Information.</strong> "Confidential Information" means any and all information disclosed by Company to Recipient which ought to be treated as confidential. This includes, but is not limited to, project ideas, business plans, and technical data shared on the platform.
        </p>
        <p>
          <strong>2. Non-Disclosure.</strong> Recipient agrees not to disclose or use any Confidential Information for any purpose other than for evaluating and potentially participating in projects on the CoStacked platform.
        </p>
        <p>
          By clicking "Accept," you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement.
        </p>
      </div>
      <footer className={styles.footer}>
        <Button onClick={onAccept}>Accept & Continue</Button>
      </footer>
    </Dialog>
  );
};