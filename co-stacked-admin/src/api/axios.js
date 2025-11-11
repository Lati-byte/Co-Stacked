// src/api/axios.js

import axios from 'axios';

// Vite exposes environment variables on the `import.meta.env` object.
// VITE_API_URL is set in your Render environment settings.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor: THE CORRECTED VERSION
// This interceptor is now completely decoupled from your Redux store,
// which breaks the circular dependency and fixes the "Cannot access 'xD'" error.
API.interceptors.request.use(
  (config) => {
    // Attempt to retrieve the admin's profile from localStorage.
    // We use a unique key 'adminProfile' to avoid conflicts with the user-facing app.
    const adminProfile = localStorage.getItem('adminProfile');
    
    if (adminProfile) {
      // Safely parse the JSON and extract the token.
      const { token } = JSON.parse(adminProfile);
      
      // If a token exists, add it to the Authorization header.
      if (token) {
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