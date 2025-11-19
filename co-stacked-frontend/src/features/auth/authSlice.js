// src/features/auth/authSlice.js
// DEPLOY FIX 2025-11-19 — force latest authSlice with userToken
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Import actions from other slices that this slice needs to react to
import {
  verifySubscription,
  verifyProfileBoost,
  cancelSubscription,
} from "../payments/paymentSlice";

// A single, consistent key for storing auth data in localStorage
const AUTH_STORAGE_KEY = "userAuth";

// Utility function to safely load the initial state from localStorage
const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) {
      return { user: null, token: null, isAuthenticated: false };
    }
    const { user, token } = JSON.parse(serializedState);
    return { user, token, isAuthenticated: !!token };
  } catch (err) {
    console.error("Could not load auth state from localStorage", err);
    return { user: null, token: null, isAuthenticated: false };
  }
};

// ===================================================================
// ASYNC THUNKS
// ===================================================================

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/verify-email", { email, token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/login", credentials);
      if (response.data && response.data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/users/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.put("/users/profile", userData);
      const currentAuth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
      if (currentAuth) {
        const updatedAuth = { ...currentAuth, user: response.data };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await API.put(
        "/users/profile/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/forgot-password", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/users/reset-password/${token}`, {
        password,
      });
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
  ...loadAuthState(), // Load user, token, and isAuthenticated on startup
  status: "idle",
  error: null,
  successMessage: null,
  unverifiedEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
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
      // Registration
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
        state.unverifiedEmail = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unverifiedEmail = action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Registration failed.";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.unverifiedEmail = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || "Invalid credentials.";
        if (action.payload?.emailNotVerified) {
          state.unverifiedEmail = action.meta.arg.email;
        }
      })

      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.message;
        state.unverifiedEmail = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Verification failed.";
      })

      // Get Profile (for persistent session)
      .addCase(getUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        state.status = "failed";
        state.error = action.payload?.message || "Session expired.";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to update profile.";
      })

      // Password Management
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to change password.";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to send reset link.";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to reset password.";
      })

      // Inter-Slice Reducers for Payment Events
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
