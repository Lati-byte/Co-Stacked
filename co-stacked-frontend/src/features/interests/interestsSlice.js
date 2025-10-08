// src/features/interests/interestsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Developer action: Sends a new interest request to a founder.
 */
export const sendInterestRequest = createAsyncThunk(
  'interests/sendRequest',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await API.post('/interests', { projectId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to send request.');
    }
  }
);

/**
 * Founder action: Fetches all interest requests they have received.
 */
export const fetchReceivedInterests = createAsyncThunk(
  'interests/fetchReceived',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/interests/received');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to fetch received requests.');
    }
  }
);

/**
 * Developer action: Fetches all interest requests they have sent.
 */
export const fetchSentInterests = createAsyncThunk(
  'interests/fetchSent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/interests/sent');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to fetch sent requests.');
    }
  }
);

/**
 * Founder action: Updates the status of an interest request (approve/reject).
 */
export const respondToInterest = createAsyncThunk(
  'interests/respond',
  async ({ interestId, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/interests/${interestId}/respond`, { status });
      // The payload now contains the updatedInterest AND the new/existing conversation object if approved
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to respond to request.');
    }
  }
);


// ===================================================================
// THE INTERESTS SLICE
// ===================================================================

const initialState = {
  receivedItems: [], // Interests a user (founder) has received
  sentItems: [],     // Interests a user (developer) has sent
  status: 'idle',      // For tracking actions like send/respond
  fetchStatus: 'idle', // For tracking the status of fetching lists
  error: null,
};

const interestsSlice = createSlice({
  name: 'interests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for SENDING a request
      .addCase(sendInterestRequest.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(sendInterestRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sentItems.unshift(action.payload);
      })
      .addCase(sendInterestRequest.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Cases for FETCHING received requests (for Founders)
      .addCase(fetchReceivedInterests.pending, (state) => { state.fetchStatus = 'loading'; })
      .addCase(fetchReceivedInterests.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.receivedItems = action.payload;
      })
      .addCase(fetchReceivedInterests.rejected, (state, action) => { state.fetchStatus = 'failed'; state.error = action.payload; })

      // Cases for FETCHING sent requests (for Developers)
      .addCase(fetchSentInterests.pending, (state) => { state.fetchStatus = 'loading'; })
      .addCase(fetchSentInterests.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.sentItems = action.payload;
      })
      .addCase(fetchSentInterests.rejected, (state, action) => { state.fetchStatus = 'failed'; state.error = action.payload; })

      // Cases for RESPONDING to a request
      .addCase(respondToInterest.pending, (state) => { state.status = 'loading'; })
      .addCase(respondToInterest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedInterest = action.payload;
        // Find the request in our list and update its data
        const index = state.receivedItems.findIndex(i => i._id === updatedInterest._id);
        if (index !== -1) {
          state.receivedItems[index] = updatedInterest;
        }
      })
      .addCase(respondToInterest.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export default interestsSlice.reducer;