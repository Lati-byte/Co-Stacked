// src/components/about/TeamMemberCard.jsx
import { Card } from '../shared/Card';
import { Linkedin } from 'lucide-react';
import styles from './TeamMemberCard.module.css';

export const TeamMemberCard = ({ imageUrl, name, role, linkedInUrl }) => {
  return (
    <Card className={styles.card}>
      <img src={imageUrl} alt={`Photo of ${name}`} className={styles.avatar} />
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.role}>{role}</p>
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
        <Linkedin size={20} />
      </a>
    </Card>
  );
};