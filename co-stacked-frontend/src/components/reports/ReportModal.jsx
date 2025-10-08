// src/components/reports/ReportModal.jsx
import { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Button } from '../shared/Button';
import { Label } from '../shared/Label';
import { Select } from '../shared/Select';
import { Textarea } from '../shared/Textarea';
import styles from './ReportModal.module.css';

const reportReasons = [
    { value: '', label: 'Select a reason...' },
    { value: 'Spam or Misleading', label: 'Spam or Misleading' },
    { value: 'Inappropriate Content', label: 'Inappropriate Content' },
    { value: 'Scam or Fraud', label: 'Scam or Fraud' },
    { value: 'Intellectual Property Violation', label: 'Intellectual Property Violation' },
    { value: 'Other', label: 'Other' },
];

export const ReportModal = ({ itemType, itemName, open, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!reason) {
            alert('Please select a reason for your report.');
            return;
        }
        onSubmit({ reason, comment });
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <h2 className={styles.title}>Report {itemType}</h2>
            <p className={styles.subtitle}>You are reporting: <strong>{itemName}</strong></p>
            <div className={styles.formGroup}>
                <Label htmlFor="reason">Reason for reporting</Label>
                <Select id="reason" options={reportReasons} value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
                <Label htmlFor="comment">Additional details (optional)</Label>
                <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4} />
            </div>
            <footer className={styles.footer}>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit Report</Button>
            </footer>
        </Dialog>
    );
};