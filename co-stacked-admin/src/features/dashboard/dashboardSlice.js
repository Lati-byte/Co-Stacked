// src/features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// IMPORTANT: We need a separate, configured Axios instance for the admin app!
// Create a file at `src/api/axios.js` for the admin app.
import API from '../../api/axios'; 

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
    stats: {}, status: 'idle', error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;