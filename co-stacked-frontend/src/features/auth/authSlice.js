// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Import payment actions (for updating user after subscription changes)
import {
  verifySubscription,
  verifyProfileBoost,
  cancelSubscription,
} from "../payments/paymentSlice";

// ===================================================================
// STORAGE KEYS – Keep everything consistent
// ===================================================================
const TOKEN_KEY = "userToken"; // ← Used by axios interceptor
const PROFILE_KEY = "userProfile"; // ← Optional: quick access to user data
const AUTH_STORAGE_KEY = "userAuth"; // ← Legacy key (we'll migrate away from it)

// Helper: Migrate old storage format → new clean format (one-time)
const migrateOldStorage = () => {
  try {
    const oldData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (oldData) {
      const { user, token } = JSON.parse(oldData);
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
      localStorage.removeItem(AUTH_STORAGE_KEY); // Clean up old key
    }
  } catch (err) {
    console.warn("Failed to migrate old auth storage", err);
  }
};

// Load initial state safely
const loadInitialState = () => {
  migrateOldStorage(); // Run once on app start

  let token = localStorage.getItem(TOKEN_KEY);
  let user = null;

  try {
    const storedUser = localStorage.getItem(PROFILE_KEY);
    if (storedUser) user = JSON.parse(storedUser);
  } catch (err) {
    console.error("Corrupted userProfile in localStorage", err);
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    status: "idle",
    error: null,
    successMessage: null,
    unverifiedEmail: null,
  };
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
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
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
      return rejectWithValue(
        error.response?.response?.data || { message: "Invalid or expired code" }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/login", credentials);

      const { user, token } = response.data;

      if (!token) throw new Error("No token received from server");

      // Save in the exact format axios interceptor expects
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid email or password";
      const emailNotVerified = error.response?.data?.emailNotVerified || false;
      return rejectWithValue({ message: msg, emailNotVerified });
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await API.get("/users/profile");
      const user = response.data;

      // Keep localStorage in sync
      localStorage.setItem(PROFILE_KEY, JSON.stringify(user));

      return user;
    } catch (error) {
      // On 401, clear everything
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
      }
      return rejectWithValue(
        error.response?.data || { message: "Failed to load profile" }
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.put("/users/profile", userData);
      const updatedUser = response.data;

      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Update failed" }
      );
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
      return rejectWithValue(
        error.response?.data || { message: "Password change failed" }
      );
    }
  }
);

// (Other thunks like forgotPassword, resetPassword remain unchanged — they’re perfect)

// ===================================================================
// SLICE
// ===================================================================

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    logout: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
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
      // Login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.unverifiedEmail = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload.message;
        if (action.payload.emailNotVerified) {
          state.unverifiedEmail = action.meta.arg.email;
        }
      })

      // Profile fetch/update
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })

      // Payment actions → update user
      .addCase(verifySubscription.fulfilled, (state, action) => {
        if (action.payload.user && state.user) {
          state.user = { ...state.user, ...action.payload.user };
          localStorage.setItem(PROFILE_KEY, JSON.stringify(state.user));
        }
      })
      .addCase(verifyProfileBoost.fulfilled, (state, action) => {
        if (action.payload.user && state.user) {
          state.user = { ...state.user, ...action.payload.user };
          localStorage.setItem(PROFILE_KEY, JSON.stringify(state.user));
        }
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        if (action.payload.user && state.user) {
          state.user = { ...state.user, ...action.payload.user };
          localStorage.setItem(PROFILE_KEY, JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, clearAuthMessages } = authSlice.actions;

export default authSlice.reducer;
