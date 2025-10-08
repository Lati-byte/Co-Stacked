// src/features/users/userManagementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Fetches the complete list of all users for the admin panel.
 */
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

/**
 * Updates a user's details by their ID. This is an admin-only action.
 */
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/admin/users/${userId}`, userData);
      return response.data; // The updated user object from the backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

/**
 * Deletes a user by their ID. This is an admin-only action.
 */
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/users/${userId}`);
      return userId; // Return the ID of the deleted user on success
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);


// ===================================================================
// THE USER MANAGEMENT SLICE
// ===================================================================

const initialState = {
  users: [],
  status: 'idle', // For tracking general action status (fetch, delete, update)
  error: null,
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for FETCHING all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Cases for UPDATING a user
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedUser = action.payload;
        // Find the user in our state array by their ID
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          // Replace the old user object with the updated one from the backend
          state.users[userIndex] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Cases for DELETING a user
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const deletedUserId = action.payload;
        // Filter the 'users' array to remove the deleted user
        state.users = state.users.filter(user => user._id !== deletedUserId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userManagementSlice.reducer;