// src/features/auth/adminAuthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Handles Admin Registration by calling the secret-key-protected backend endpoint.
 */
export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await API.post('/admin/register', adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Handles Admin Login, including a client-side check for the 'isAdmin' flag.
 */
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/login', credentials);
      const { user, token } = response.data;
      
      if (!user || !user.isAdmin) {
        return rejectWithValue({ message: 'Access Denied. Not an administrator.' });
      }
      
      localStorage.setItem('adminToken', token);
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Handles fetching the admin's profile using a stored token.
 * This is essential for maintaining a persistent login session.
 */
export const getAdminProfile = createAsyncThunk(
  'auth/getAdminProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
        const { token } = getState().auth;
        if (!token) return rejectWithValue({ message: 'No token found' });
        
        const response = await API.get('/users/profile'); // Token is sent automatically
        
        if (!response.data || !response.data.isAdmin) {
             return rejectWithValue({ message: 'User is not an administrator.' });
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
  }
);


// ===================================================================
// THE ADMIN AUTH SLICE
// ===================================================================

const initialState = {
  user: null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  status: 'idle',
  error: null,
};

const adminAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      localStorage.removeItem('adminToken');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Registration Cases ---
      .addCase(registerAdmin.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerAdmin.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(registerAdmin.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload?.message || 'Admin registration failed.'; })

      // --- Login Cases ---
      .addCase(loginAdmin.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Login failed. Please try again.';
      })

      // --- Get Admin Profile Cases (for persistent session) ---
      .addCase(getAdminProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        // If the token is invalid or user is not an admin, perform a full logout.
        state.status = 'failed';
        state.error = action.payload?.message || 'Session expired or invalid.';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('adminToken');
      });
  },
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;