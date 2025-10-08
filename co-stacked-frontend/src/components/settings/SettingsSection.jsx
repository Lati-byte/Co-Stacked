// src/components/settings/SettingsSection.jsx
import styles from './SettingsSection.module.css';
export const SettingsSection = ({ title, description, children }) => {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};