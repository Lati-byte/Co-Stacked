// src/api/axios.js

import axios from 'axios';

// 1. DYNAMICALLY SET THE API URL (This part is perfect)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. USE AN AXIOS INTERCEPTOR - THE CORRECT WAY
// This interceptor now has ZERO dependencies on your Redux store, breaking the loop.
API.interceptors.request.use(
  (config) => {
    // Attempt to retrieve user info from localStorage.
    // We assume you store an object like { token: '...', user: {...} }
    const userProfile = localStorage.getItem('userProfile');
    
    if (userProfile) {
      const { token } = JSON.parse(userProfile);
      if (token) {
        // If a token exists, add it to the Authorization header.
        config.headers['Authorization'] = `Bearer ${token}`;
      }
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