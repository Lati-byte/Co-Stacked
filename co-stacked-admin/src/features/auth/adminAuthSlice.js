// src/features/auth/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// UTILITY: Get admin profile from localStorage
// ===================================================================
const adminProfile = JSON.parse(localStorage.getItem('adminProfile'));

// ===================================================================
// ASYNC THUNKS
// ===================================================================

// --- Thunk for Admin LOGIN (Corrected) ---
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      // Use a dedicated admin login endpoint for better security and logic separation
      const response = await API.post('/admin/login', credentials);
      
      // THE FIX: Check for response data and store the entire profile object
      if (response.data && response.data.token) {
        localStorage.setItem('adminProfile', JSON.stringify(response.data));
      } else {
        // This case handles unexpected API responses gracefully
        return rejectWithValue({ message: 'Invalid server response.' });
      }

      return response.data; // This will contain { user, token }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Thunk for Admin REGISTRATION ---
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

// --- Thunk for Admin Email Verification ---
export const verifyAdminEmail = createAsyncThunk(
  'auth/verifyAdminEmail',
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/verify-email', { email, token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Thunk for VERIFYING a session ---
export const getAdminProfile = createAsyncThunk(
  'auth/getAdminProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Interceptor handles the token automatically
      const response = await API.get('/admin/profile'); // Should hit a dedicated admin profile route
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- The Slice Definition (Corrected) ---
const initialState = {
  user: adminProfile ? adminProfile.user : null,
  token: adminProfile ? adminProfile.token : null,
  isAuthenticated: !!(adminProfile && adminProfile.token),
  status: 'idle',
  error: null,
  successMessage: null,
  unverifiedEmail: null,
};

const adminAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      // CORRECTED: Remove 'adminProfile' to match login logic
      localStorage.removeItem('adminProfile');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.unverifiedEmail = null;
      state.error = null;
      state.successMessage = null;
    },
    clearAuthState: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.unverifiedEmail = null;
      })
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
        state.token = null;
        state.error = action.payload?.message || 'Login failed.';
        if (action.payload?.emailNotVerified) {
          state.unverifiedEmail = action.meta.arg.email;
        }
      })

      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
        state.unverifiedEmail = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
        state.unverifiedEmail = action.meta.arg.email;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed.';
      })
      
      // Email Verification
      .addCase(verifyAdminEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyAdminEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
        state.unverifiedEmail = null;
      })
      .addCase(verifyAdminEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Verification failed.';
      })

      // Get Profile
      .addCase(getAdminProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getAdminProfile.rejected, (state) => {
        localStorage.removeItem('adminProfile');
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.status = 'failed';
      });
  },
});

export const { logoutAdmin, clearAuthState } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;