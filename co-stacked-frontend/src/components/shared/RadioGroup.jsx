// src/components/shared/RadioGroup.jsx
import styles from './RadioGroup.module.css';
export const RadioGroup = ({ name, options, selectedValue, onChange }) => {
  return (
    <div className={styles.group}>
      {options.map(option => (
        <div key={option.value} className={styles.item}>
          <input
            type="radio" id={`${name}-${option.value}`} name={name}
            value={option.value} checked={selectedValue === option.value}
            onChange={onChange} className={styles.input}
          />
          <label htmlFor={`${name}-${option.value}`} className={styles.label}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};