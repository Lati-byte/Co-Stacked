// src/features/connections/connectionsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

// GET a user's list of accepted connections
export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/connections');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// GET a user's pending received requests
export const fetchPendingRequests = createAsyncThunk(
  'connections/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/connections/pending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// POST to send a new connection request
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

// PUT to accept a connection request
export const acceptConnectionRequest = createAsyncThunk(
  'connections/acceptRequest',
  async (requesterId, { rejectWithValue }) => {
    try {
      const response = await API.put('/connections/accept', { requesterId });
      // We pass the requesterId in the payload to know which request to remove from the pending list
      return { status: response.data.status, requesterId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// DELETE to remove, cancel, or decline a connection/request
export const removeOrCancelConnection = createAsyncThunk(
  'connections/removeOrCancel',
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/connections/${otherUserId}`);
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
  connections: [], // List of accepted connections (user objects)
  pendingRequests: [], // List of received pending requests (connection objects)
  status: 'idle', // For list-fetching actions ('idle', 'loading', 'succeeded', 'failed')
  actionStatus: 'idle', // For single actions like send, accept, delete
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
      .addCase(fetchConnections.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Fetching pending requests
      .addCase(fetchPendingRequests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Handling the result of accepting a request
      .addCase(acceptConnectionRequest.pending, (state) => { state.actionStatus = 'loading'; })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        // Remove the accepted request from the pending list
        state.pendingRequests = state.pendingRequests.filter(
          req => req.requester._id !== action.payload.requesterId
        );
        // We might need to refetch the main connections list to get the new user,
        // or optimistically add them if the backend returned the user object.
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => { state.actionStatus = 'failed'; state.error = action.payload; })

      // Handling the result of removing/declining/canceling
      .addCase(removeOrCancelConnection.pending, (state) => { state.actionStatus = 'loading'; })
      .addCase(removeOrCancelConnection.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const otherUserId = action.payload.otherUserId;
        // Remove from connections list if they were there
        state.connections = state.connections.filter(user => user._id !== otherUserId);
        // Remove from pending requests list if they were there
        state.pendingRequests = state.pendingRequests.filter(req => req.requester._id !== otherUserId);
      })
      .addCase(removeOrCancelConnection.rejected, (state, action) => { state.actionStatus = 'failed'; state.error = action.payload; });
  },
});

export default connectionsSlice.reducer;