// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Make sure this is your correct backend URL
});

// This interceptor automatically attaches the token to every request.
API.interceptors.request.use((config) => {
  // We use a unique name for the admin token to avoid conflicts.
  const token = localStorage.getItem('costacked-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;