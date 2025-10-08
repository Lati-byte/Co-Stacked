// src/components/dashboard/AdminStatCard.jsx
import styles from './AdminStatCard.module.css';
import { ArrowUpRight } from 'lucide-react';
export const AdminStatCard = ({ title, value, change, Icon, changeType = 'increase' }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <Icon className={styles.icon} size={22} />
      </div>
      <div className={styles.body}>
        <p className={styles.value}>{value}</p>
        <div className={`${styles.change} ${styles[changeType]}`}>
          <ArrowUpRight size={16} />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};