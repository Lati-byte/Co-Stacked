// src/api/axios.js
import axios from 'axios';

// The base URL for our backend API. All requests will be prefixed with this.
const API_BASE_URL = 'http://localhost:5001/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// We will add an interceptor here to automatically attach the admin's auth token
// once we build the admin login system.
API.interceptors.request.use((config) => {
  // We will name the admin token something different to avoid conflicts with the user app
  const token = localStorage.getItem('adminToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default API;