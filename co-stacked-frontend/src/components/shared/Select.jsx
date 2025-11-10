// src/components/shared/Select.jsx

import styles from './Select.module.css';
import PropTypes from 'prop-types';

export const Select = ({ options, ...props }) => {
  return (
    <select className={styles.select} {...props}>
      {options.map(option => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};