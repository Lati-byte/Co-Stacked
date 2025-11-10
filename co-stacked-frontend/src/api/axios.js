// src/api/axios.js

import axios from 'axios';
import { store } from '../store/store'; // Ensure this path correctly points to your Redux store

// 1. DYNAMICALLY SET THE API URL
// Vite exposes environment variables on the `import.meta.env` object.
// We read the VITE_API_URL that you have set in your Render service settings.
// If it's not found (e.g., during local development), it safely falls back to localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. USE AN AXIOS INTERCEPTOR TO AUTOMATICALLY ATTACH THE TOKEN
// This function runs before every single request.
API.interceptors.request.use(
  (config) => {
    // Get the current, live state directly from the Redux store.
    // This is more reliable than localStorage, which can sometimes be out of sync.
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      // If a token exists in our Redux state, add it to the Authorization header.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Return the modified config so the request can proceed.
    return config;
  },
  (error) => {
    // Handle any errors during the request setup.
    return Promise.reject(error);
  }
);

export default API;