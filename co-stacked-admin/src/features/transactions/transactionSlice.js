// src/features/transactions/transactionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios'; // Your configured Axios instance

// ===================================================================
// ASYNC THUNK
// ===================================================================

/**
 * Fetches all transactions for the admin dashboard.
 */
export const fetchAllTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/transactions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

// ===================================================================
// THE TRANSACTION SLICE
// ===================================================================

const initialState = {
  transactions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;