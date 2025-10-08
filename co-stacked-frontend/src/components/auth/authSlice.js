// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS - For handling all authentication-related API calls
// ===================================================================

/**
 * Handles User Registration API call.
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Handles User Login API call, storing the token on success.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/login', credentials);
      const { user, token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Handles fetching the user's profile using a stored token.
 * This is crucial for creating persistent login sessions.
 */
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue({ message: 'No token found' });
      }
      // Token will be sent automatically by our Axios interceptor
      const response = await API.get('/users/profile'); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Handles updating the logged-in user's profile information.
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // Token is sent automatically by our Axios interceptor
      const response = await API.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// ===================================================================
// THE AUTH SLICE
// ===================================================================

const initialState = {
  user: null, // Will hold the user object: { id, name, email, role, bio, etc. }
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous action to handle user logout
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration cases
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload?.message || 'Registration failed.'; })

      // Login cases
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Invalid credentials.';
      })

      // Get User Profile cases (for persistent session)
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        // If fetching the profile fails, the token is invalid. Log the user out completely.
        localStorage.removeItem('token');
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || 'Session expired. Please log in again.';
        state.status = 'failed';
      })
      
      // Update User Profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Update the user in our store with the new data
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update profile.';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;