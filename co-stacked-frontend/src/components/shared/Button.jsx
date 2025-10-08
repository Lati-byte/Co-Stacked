// src/components/shared/Button.jsx

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // 1. Import Link
import styles from './Button.module.css';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  to = null, // 2. Add a 'to' prop for navigation
}) => {
  // Combine the base button class with the variant and any extra classes
  const buttonClasses = `${styles.button} ${styles[variant]} ${className}`;

  // 3. If the 'to' prop is provided, render a Link.
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  // Otherwise, render a regular button.
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  to: PropTypes.string, // 4. Add 'to' to our prop validation
};