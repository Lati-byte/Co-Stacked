// src/api/axios.js

import axios from 'axios';

// Dynamic base URL – perfect
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

// INTERCEPTOR: Read token from localStorage ONLY (NO Redux import!)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken'); // ← THIS MUST MATCH authSlice

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler – auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear everything
      localStorage.removeItem('userToken');
      localStorage.removeItem('userProfile');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;