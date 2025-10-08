// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// === ADD THIS INTERCEPTOR ===
// This function will run BEFORE every single request that is sent using this API instance.
API.interceptors.request.use((config) => {
  // Get the token from our Redux state via localStorage.
  const token = localStorage.getItem('token');
  
  if (token) {
    // If the token exists, add the 'Authorization' header to the request.
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Return the modified config so the request can proceed.
  return config;
}, (error) => {
  // Handle any errors that might occur during request setup
  return Promise.reject(error);
});
// =============================

export default API;