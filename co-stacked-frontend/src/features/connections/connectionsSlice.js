// src/features/connections/connectionsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

// --- READ OPERATIONS ---
export const fetchConnections = createAsyncThunk(
  'connections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/connections');
      return response.data; // Array of user objects
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'connections/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/connections/pending');
      return response.data; // Array of connection request objects
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- WRITE OPERATIONS ---
export const sendConnectionRequest = createAsyncThunk(
  'connections/sendRequest',
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await API.post('/connections/request', { recipientId });
      return response.data; // { status: 'pending_sent' }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'connections/acceptRequest',
  async (requesterId, { rejectWithValue }) => {
    try {
      const response = await API.put('/connections/accept', { requesterId });
      // We return the original requesterId to know which request to remove from the pending list
      return { status: response.data.status, requesterId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeOrCancelConnection = createAsyncThunk(
  'connections/removeOrCancel',
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/connections/${otherUserId}`);
      // Return the other user's ID to update the UI
      return { status: response.data.status, otherUserId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// ===================================================================
// THE CONNECTIONS SLICE
// ===================================================================

const initialState = {
  connections: [],
  pendingRequests: [],
  status: 'idle',
  actionStatus: 'idle',
  error: null,
};

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching all connections
      .addCase(fetchConnections.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload.message; })

      // Fetching pending requests
      .addCase(fetchPendingRequests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload.message; })

      // Accepting a request
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        const { requesterId } = action.payload;
        // Find the accepted request to get the user object
        const acceptedRequest = state.pendingRequests.find(req => req.requester._id === requesterId);
        if (acceptedRequest) {
          // Add the user to the main connections list
          state.connections.unshift(acceptedRequest.requester);
          // Remove the request from the pending list
          state.pendingRequests = state.pendingRequests.filter(req => req.requester._id !== requesterId);
        }
      })

      // Removing a connection OR declining/canceling a request
      .addCase(removeOrCancelConnection.fulfilled, (state, action) => {
        const { otherUserId } = action.payload;
        // Remove from main connections list
        state.connections = state.connections.filter(user => user._id !== otherUserId);
        // Remove from pending requests list (if they were the requester)
        state.pendingRequests = state.pendingRequests.filter(req => req.requester._id !== otherUserId);
      });
  },
});

export default connectionsSlice.reducer;