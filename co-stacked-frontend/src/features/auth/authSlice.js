// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS (for API calls)
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
 * This is crucial for persistent login sessions.
 */
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get the token from the state (which was initialized from localStorage)
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Your backend must have a protected route like GET /api/users/profile
      // that returns user data based on the token.
      const response = await API.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      // If the token is invalid or expired, the backend will return an error.
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
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
  user: null, // This will hold the user object { id, name, email, role }
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'), // Boolean check for token existence
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
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed.';
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
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
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload; // Payload is the user object from the API
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        // If fetching the profile fails, it means the token is invalid.
        // We log the user out completely as a security measure.
        state.status = 'failed';
        state.error = action.payload?.message || 'Session expired. Please log in again.';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;