// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Import the Provider and our new admin store
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { PageTitleProvider } from './context/PageTitleContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PageTitleProvider> {/* Wrap App with the new provider */}
        <App />
      </PageTitleProvider>
    </Provider>
  </React.StrictMode>,
);