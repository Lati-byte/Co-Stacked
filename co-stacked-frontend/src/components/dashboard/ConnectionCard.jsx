// src/components/dashboard/ConnectionCard.jsx
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Avatar } from '../shared/Avatar';
import { MessageSquare, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ConnectionCard.module.css';

export const ConnectionCard = ({ connection, onDisconnect }) => {
    const developer = connection.senderId;
    const project = connection.projectId;

    if (!developer || !project) return null;

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <Avatar src={developer.avatarUrl} fallback={developer.name.charAt(0)} />
                <div>
                    <p className={styles.name}>{developer.name}</p>
                    <p className={styles.role}>Connected on: <strong>{project.title}</strong></p>
                </div>
            </div>
            <div className={styles.actions}>
                <Button to="/messages" variant="secondary" className={styles.actionButton}>
                    <MessageSquare size={16} /><span>Message</span>
                </Button>
                <Button onClick={onDisconnect} className={`${styles.actionButton} ${styles.disconnectButton}`}>
                    <XCircle size={16} /><span>Cut Connection</span>
                </Button>
            </div>
        </Card>
    );
};