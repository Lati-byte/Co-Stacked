// src/components/shared/Textarea.jsx
import styles from './Textarea.module.css';
export const Textarea = ({ id, name, placeholder, rows, required, value, onChange }) => (
  <textarea 
    id={id} name={name} placeholder={placeholder} rows={rows} required={required} value={value} onChange={onChange}
    className={styles.textarea} 
  />
);