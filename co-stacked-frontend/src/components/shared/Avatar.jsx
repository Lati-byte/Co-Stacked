// src/components/shared/Avatar.jsx
import styles from './Avatar.module.css';
export const Avatar = ({ src, fallback, alt = '' }) => {
  return (
    <div className={styles.avatar}>
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <span className={styles.fallback}>{fallback}</span>
      )}
    </div>
  );
};