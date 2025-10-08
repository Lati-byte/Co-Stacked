// src/features/reports/reportsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/reports');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);
// Future thunks for 'resolveReport' will go here

const initialState = { reports: [], status: 'idle', error: null };

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export default reportsSlice.reducer;