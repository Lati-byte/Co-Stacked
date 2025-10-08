// src/components/shared/Select.jsx

import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

// Added name, id, and required to the props
export const Select = ({ options, value, onChange, name, id, required, className = '' }) => {
  const wrapperClasses = `${styles.wrapper} ${className}`;

  return (
    <div className={wrapperClasses}>
      <select 
        // Pass all the necessary form-related props to the HTML select element
        name={name}
        id={id}
        required={required}
        value={value} 
        onChange={onChange} // <-- THE CRITICAL FIX
        className={styles.select}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.value === ''}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.icon} />
    </div>
  );
};

// Add the new props to our prop validation
Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};