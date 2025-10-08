import styles from './Button.module.css';
export const Button = ({ children, onClick, variant = 'primary', className = '' }) => (
  <button className={`${styles.button} ${styles[variant]} ${className}`} onClick={onClick}>
    {children}
  </button>
);