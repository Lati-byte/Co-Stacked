// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// Import actions from other slices that this slice needs to react to.
import { verifySubscription, verifyProfileBoost, cancelSubscription } from '../payments/paymentSlice';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

// --- NEW: Thunk for Forgot Password ---
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- NEW: Thunk for Reset Password ---
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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

// --- NEW: Thunk for Email Verification ---
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/verify-email', { email, token });
      return response.data; // e.g., { success: true, message: '...' }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Handles fetching the user's profile using a stored token for persistent login.
 */
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue('No token found');
      }
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
      const response = await API.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * NEW: Handles changing the user's password.
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      // passwordData will be { currentPassword, newPassword }
      const response = await API.put('/users/profile/change-password', passwordData);
      return response.data; // e.g., { message: 'Password updated successfully.' }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// ===================================================================
// THE AUTH SLICE
// ===================================================================

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  status: 'idle',
  error: null,
   successMessage: null,
  unverifiedEmail: null, // For feedback on successful actions
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
      state.successMessage = null;
      state.unverifiedEmail = null;
    },
    // NEW: Synchronous action to clear feedback messages
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- UPDATED: Registration cases ---
      .addCase(registerUser.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
        state.unverifiedEmail = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.status = 'succeeded';
        // Store the email from the form data payload to use on the verify page
        state.unverifiedEmail = action.meta.arg.email; 
      })
      .addCase(registerUser.rejected, (state, action) => { 
        state.status = 'failed'; 
        state.error = action.payload?.message || 'Registration failed.'; 
      })

      // --- UPDATED: Login cases ---
      .addCase(loginUser.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null; 
        state.unverifiedEmail = null;
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
        // If the backend flag exists, store the email to prompt for verification
        if (action.payload?.emailNotVerified) {
          state.unverifiedEmail = action.meta.arg.email;
        }
      })

      // --- NEW: Email Verification cases ---
      .addCase(verifyEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
        state.unverifiedEmail = null; // Clear the temporary email on successful verification
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Verification failed.';
      })

      // Get User Profile cases
      .addCase(getUserProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.status = 'failed';
        state.error = action.payload?.message || 'Session expired.';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Update User Profile cases
      .addCase(updateUserProfile.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload.message || 'Failed to update profile.'; })

      // NEW: Cases for Change Password
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to change password.';
      })

      // Inter-Slice Reducers for reacting to payment success
      .addCase(verifySubscription.fulfilled, (state, action) => {
        const { user: updatedUser } = action.payload;
        if (state.user && updatedUser) {
          state.user = { ...state.user, ...updatedUser };
        }
      })
      .addCase(verifyProfileBoost.fulfilled, (state, action) => {
          const { user: updatedUser } = action.payload;
          if (state.user && updatedUser) {
              state.user = { ...state.user, ...updatedUser };
          }
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to send reset link.';
      })
       // --- NEW: Add a listener for when a subscription is successfully canceled ---
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        const { user: updatedUser } = action.payload;
        if (state.user && updatedUser) {
          // The backend sends back the user object with `isVerified: false`.
          // We update the state here to keep the UI in sync.
          state.user = { ...state.user, ...updatedUser };
        }
      })

      // --- NEW: Cases for Reset Password ---
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to reset password.';
      });
  },
});

export const { logout, clearAuthMessages } = authSlice.actions;

export default authSlice.reducer;