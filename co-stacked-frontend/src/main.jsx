// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/global.css';

// 1. Import the Provider component from react-redux and our store
import { Provider } from 'react-redux';
import { store } from './store/store.js';

/**
 * The root of our React application.
 * By wrapping the <App /> component with the <Provider>, every component
 * within our entire application (like Header, LoginPage, etc.) will
 * be able to access the Redux store's state and dispatch actions.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the App with the Provider and pass the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);