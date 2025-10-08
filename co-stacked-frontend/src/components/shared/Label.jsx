// src/components/shared/Label.jsx
import styles from './Label.module.css';
export const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>{children}</label>
);