// src/api/axios.js

import axios from 'axios';

// Dynamically use your .env variable (perfect for Render + local dev)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Optional: increase timeout on Render (free tier can be slow on cold starts)
  timeout: 10000,
});

// INTERCEPTOR: Automatically attach JWT token to EVERY request
API.interceptors.request.use(
  (config) => {
    // We store only the token directly under 'userToken' (cleaner & faster)
    const token = localStorage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// OPTIONAL BUT RECOMMENDED: Global 401 handler (auto logout on token expire)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → clear storage and redirect to login
      localStorage.removeItem('userToken');
      localStorage.removeItem('userProfile'); // if you still use it
      window.location.href = '/login'; // or use your router
    }
    return Promise.reject(error);
  }
);

export default API;