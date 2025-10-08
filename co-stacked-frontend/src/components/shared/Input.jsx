// The CORRECTED src/components/shared/Input.jsx

import PropTypes from 'prop-types';
import styles from './Input.module.css';

export const Input = ({ type = 'text', placeholder, value, onChange, name, id, required, autoComplete, className = '' }) => {
  const inputClasses = `${styles.input} ${className}`;

  return (
    <input
      // Pass all the props through to the actual input element
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange} // <-- THE CRITICAL FIX
      name={name}
      id={id}
      required={required}
      autoComplete={autoComplete}
      className={inputClasses}
    />
  );
};

// Also good practice to add all props to propTypes
Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
};