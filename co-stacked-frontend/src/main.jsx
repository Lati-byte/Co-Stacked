// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Assuming global.css is for additional global styles
import './styles/global.css';

// Import the Provider component from react-redux and our store
import { Provider } from 'react-redux';
import { store } from './store/store.js';

// 1. Import the ThemeProvider from our new context file
import { ThemeProvider } from './context/ThemeContext';

/**
 * The root of our React application.
 * - The <Provider> makes the Redux store available to all components.
 * - The <ThemeProvider> makes the theme (light/dark) and toggle function available.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 2. Wrap the entire App with the ThemeProvider */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);