// src/context/ThemeContext.jsx

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// Create the context with a default value
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Create a custom hook for easy consumption of the context
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. We initialize it from localStorage or system preference.
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage for a saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // 2. If no saved theme, check the user's OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    // 3. Default to 'light'
    return 'light';
  });

  // Effect to apply the theme to the <html> element and save to localStorage
  useEffect(() => {
    // Add the `data-theme` attribute to the root <html> element
    document.documentElement.setAttribute('data-theme', theme);
    // Save the user's preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // The function to toggle between light and dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // useMemo to prevent the context value from being recreated on every render
  const value = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};