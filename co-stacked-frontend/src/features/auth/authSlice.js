// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// Import actions from other slices that this slice needs to react to.
import { verifySubscription, verifyProfileBoost, cancelSubscription } from '../payments/paymentSlice';

// ===================================================================
// UTILITY: Get user profile from localStorage
// ===================================================================
const userProfile = JSON.parse(localStorage.getItem('userProfile'));


// ===================================================================
// ASYNC THUNKS
// ===================================================================

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

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error)      {
      return rejectWithValue(error.response.data);
    }
  }
);

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
 * Handles User Login API call, storing the entire user profile on success.
 * THIS IS THE CORRECTED FUNCTION.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/login', credentials);
      
      // THE FIX: Check if the response contains the user and token.
      if (response.data && response.data.token) {
        // Store the entire object { user: {...}, token: "..." }
        // This makes it compatible with our axios interceptor.
        localStorage.setItem('userProfile', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/verify-email', { email, token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // The interceptor automatically adds the token, so we just make the call.
      const response = await API.get('/users/profile'); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.put('/users/profile', userData);
      // After updating, save the new user data to local storage as well to keep it in sync
      const currentProfile = JSON.parse(localStorage.getItem('userProfile'));
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, user: response.data };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await API.put('/users/profile/change-password', passwordData);
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
  user: userProfile ? userProfile.user : null,
  token: userProfile ? userProfile.token : null,
  isAuthenticated: !!(userProfile && userProfile.token),
  status: 'idle',
  error: null,
  successMessage: null,
  unverifiedEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // CORRECTED: Remove 'userProfile' to match the login logic.
      localStorage.removeItem('userProfile');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      state.unverifiedEmail = null;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration cases
      .addCase(registerUser.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
        state.unverifiedEmail = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.status = 'succeeded';
        state.unverifiedEmail = action.meta.arg.email; 
      })
      .addCase(registerUser.rejected, (state, action) => { 
        state.status = 'failed'; 
        state.error = action.payload?.message || 'Registration failed.'; 
      })

      // CORRECTED: Login cases
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
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || 'Invalid credentials.';
        if (action.payload?.emailNotVerified) {
          state.unverifiedEmail = action.meta.arg.email;
        }
      })

      // Email Verification cases
      .addCase(verifyEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
        state.unverifiedEmail = null;
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
        localStorage.removeItem('userProfile');
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

      // Change Password cases
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

      // Forgot Password cases
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
      
      // Reset Password cases
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
      })

      // Inter-Slice Reducers
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
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        const { user: updatedUser } = action.payload;
        if (state.user && updatedUser) {
          state.user = { ...state.user, ...updatedUser };
        }
      });
  },
});

export const { logout, clearAuthMessages } = authSlice.actions;

export default authSlice.reducer;