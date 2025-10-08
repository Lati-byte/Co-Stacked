// src/features/users/usersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// Import the action from authSlice to listen for it
import { updateUserProfile } from '../auth/authSlice';

/**
 * Async Thunk to fetch the list of all users for the 'Find Talent' page.
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/users');
      return response.data; // The payload will be the array of user objects
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not fetch users');
    }
  }
);

/**
 * The Redux state slice for managing the public list of users.
 */
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],       // Holds the array of all users
    status: 'idle',  // Tracks the data fetching status
    error: null,
  },
  reducers: {},
  // This handles the state changes for our async thunks
  extraReducers: (builder) => {
    builder
      // Cases for fetching the entire user list
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Case for synchronizing state after a user updates their own profile
      // This listener ensures our public user list stays up-to-date without a full refetch.
      .addCase(updateUserProfile.fulfilled, (state, action) => {
          const updatedUser = action.payload;
          // The updated user object from the API uses '_id' from MongoDB
          const userIndex = state.items.findIndex(user => user._id === updatedUser._id);

          if (userIndex !== -1) {
              // Replace the old user data with the fresh data from the server
              state.items[userIndex] = updatedUser;
          }
      });
  },
});

export default usersSlice.reducer;