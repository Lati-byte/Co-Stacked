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

// --- Thunk for Admin LOGIN ---
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/admin/login', credentials);
      
      if (response.data && response.data.token) {
        localStorage.setItem('adminProfile', JSON.stringify(response.data));
      } else {
        return rejectWithValue({ message: 'Invalid server response.' });
      }

      return response.data;
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

// --- Thunk for VERIFYING a session ---
export const getAdminProfile = createAsyncThunk(
  'auth/getAdminProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- The Slice Definition (Corrected and Simplified) ---
const initialState = {
  user: adminProfile ? adminProfile.user : null,
  token: adminProfile ? adminProfile.token : null,
  isAuthenticated: !!(adminProfile && adminProfile.token),
  status: 'idle',
  error: null,
  successMessage: null,
};

const adminAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      localStorage.removeItem('adminProfile');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
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
      })

      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The component will handle the redirect. We just set a success message.
        state.successMessage = action.payload.message;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed.';
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