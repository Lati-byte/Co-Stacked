// src/features/notifications/adminNotificationsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios'; // Your admin app's configured Axios instance

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Fetches the admin's unread notifications.
 */
export const fetchAdminNotifications = createAsyncThunk(
  'adminNotifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to load notifications.');
    }
  }
);

/**
 * Marks all admin notifications as read on the backend.
 */
export const markAdminNotificationsAsRead = createAsyncThunk(
  'adminNotifications/markAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await API.put('/admin/notifications/mark-read');
      // No payload is needed on success, the slice will just clear the items.
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to update notifications.');
    }
  }
);

// ===================================================================
// THE ADMIN NOTIFICATIONS SLICE
// ===================================================================

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const adminNotificationsSlice = createSlice({
  name: 'adminNotifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetching notifications
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Cases for marking notifications as read
      .addCase(markAdminNotificationsAsRead.pending, (state) => {
        // Optimistic update: clear the notifications immediately for a snappy UI
        state.items = [];
      })
      .addCase(markAdminNotificationsAsRead.fulfilled, (state) => {
        // The optimistic update already cleared the items, so we just need to confirm success.
        state.status = 'succeeded';
      })
      .addCase(markAdminNotificationsAsRead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        // In a real-world scenario, you might want to refetch notifications here to undo the optimistic update.
      });
  },
});

export default adminNotificationsSlice.reducer;