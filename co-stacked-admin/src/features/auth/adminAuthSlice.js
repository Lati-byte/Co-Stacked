// src/features/auth/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const TOKEN_NAME = 'costacked-admin-token';

// --- Thunk for Admin LOGIN ---
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/login', credentials);
      const { user, token } = response.data;
      if (!user?.isAdmin) {
        return rejectWithValue({ message: 'Access Denied: Not an administrator.' });
      }
      return { user, token };
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

// --- NEW: Thunk for Admin Email Verification ---
export const verifyAdminEmail = createAsyncThunk(
  'auth/verifyAdminEmail',
  async ({ email, token }, { rejectWithValue }) => {
    try {
      // This uses the same public endpoint as the user-frontend
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
      const response = await API.get('/users/profile');
      if (!response.data?.isAdmin) {
        return rejectWithValue({ message: 'Access Denied: Not an administrator.' });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- The Slice Definition ---
const initialState = {
  user: null,
  token: localStorage.getItem(TOKEN_NAME) || null,
  isAuthenticated: !!localStorage.getItem(TOKEN_NAME),
  status: 'idle',
  error: null,
  successMessage: null,
  unverifiedEmail: null, // <-- NEW state field to track who needs verification
};

const adminAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      localStorage.removeItem(TOKEN_NAME);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.unverifiedEmail = null; // Clear on logout
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
        state.unverifiedEmail = null; // Clear on new login attempt
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(TOKEN_NAME, action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed.';
        // If the backend flag exists, store the email to prompt for verification
        if (action.payload?.emailNotVerified) {
          state.unverifiedEmail = action.meta.arg.email;
        }
      })

      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
        state.unverifiedEmail = null; // Clear on new registration attempt
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
        // Store the email from the form data to use on the verify page
        state.unverifiedEmail = action.meta.arg.email;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed.';
      })
      
      // NEW: Email Verification cases
      .addCase(verifyAdminEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyAdminEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message;
        state.unverifiedEmail = null; // Clear on success
      })
      .addCase(verifyAdminEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Verification failed.';
      })

      // Get Profile (for persistent session)
      .addCase(getAdminProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getAdminProfile.rejected, (state) => {
        localStorage.removeItem(TOKEN_NAME);
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.status = 'failed';
      });
  },
});

export const { logoutAdmin, clearAuthState } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;