// src/api/axios.js

import axios from 'axios';
import { store } from '../store/store'; // Assuming your store is here

// Vite exposes environment variables on the `import.meta.env` object.
// VITE_API_URL is set in your Render environment settings.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor: This is a powerful feature that runs before every request.
// It automatically attaches the JWT token to the Authorization header if it exists.
API.interceptors.request.use(
  (config) => {
    // Get the current state from the Redux store
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;