// src/features/reviews/reviewsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Fetches all reviews for a specific developer.
 */
export const fetchReviewsForUser = createAsyncThunk(
  'reviews/fetchForUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/reviews/user/${userId}`);
      return { userId, reviews: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to load reviews.');
    }
  }
);

/**
 * Submits a new review for a developer.
 */
export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      // reviewData: { rating, comment, developerId, projectId }
      const response = await API.post('/reviews', reviewData);
      return response.data; // The newly created review object
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to submit review.');
    }
  }
);

// ===================================================================
// THE REVIEWS SLICE
// ===================================================================

const initialState = {
  // Store reviews keyed by the developer's ID for efficient lookup
  reviewsByUser: {},
  status: 'idle', // For fetching
  createStatus: 'idle', // For creating
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetching reviews for a user
      .addCase(fetchReviewsForUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsForUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviewsByUser[action.payload.userId] = action.payload.reviews;
      })
      .addCase(fetchReviewsForUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Cases for creating a new review
      .addCase(createReview.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const newReview = action.payload;
        const developerId = newReview.developerId;
        // If we have reviews for this user, add the new one to the top
        if (state.reviewsByUser[developerId]) {
          state.reviewsByUser[developerId].unshift(newReview);
        } else {
          // Otherwise, create a new entry for them
          state.reviewsByUser[developerId] = [newReview];
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;