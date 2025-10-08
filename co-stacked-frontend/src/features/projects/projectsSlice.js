// src/features/projects/projectsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

// --- READ (All Projects) ---
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not fetch projects');
    }
  }
);

// --- READ (My Projects) ---
export const fetchMyProjects = createAsyncThunk(
  'projects/fetchMyProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects/myprojects'); // Calls the new protected endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not fetch your projects');
    }
  }
);

// --- CREATE ---
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await API.post('/projects', projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- UPDATE ---
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- DELETE ---
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await API.delete(`/projects/${projectId}`);
      return projectId; // Return the ID of the deleted project on success
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ===================================================================
// THE PROJECTS SLICE
// ===================================================================

const initialState = {
  items: [],      // For the public list of all projects
  myItems: [],    // For the private list of the logged-in user's projects
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Cases for ALL projects ---
      .addCase(fetchProjects.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // --- Cases for MY projects ---
      .addCase(fetchMyProjects.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myItems = action.payload;
      })
      .addCase(fetchMyProjects.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // --- Cases for CREATE ---
      .addCase(createProject.pending, (state) => { state.status = 'loading'; })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add to both lists to keep the UI in sync
        state.items.unshift(action.payload);
        state.myItems.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload.message || 'Failed to create project.'; })

      // --- Cases for UPDATE ---
      .addCase(updateProject.pending, (state) => { state.status = 'loading'; })
      .addCase(updateProject.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const updatedProject = action.payload;
          // Find and update the project in both lists
          const itemsIndex = state.items.findIndex(p => p._id === updatedProject._id);
          if (itemsIndex !== -1) state.items[itemsIndex] = updatedProject;
          const myItemsIndex = state.myItems.findIndex(p => p._id === updatedProject._id);
          if (myItemsIndex !== -1) state.myItems[myItemsIndex] = updatedProject;
      })
      .addCase(updateProject.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload.message || 'Failed to update project.'; })
      
      // --- Cases for DELETE ---
      .addCase(deleteProject.pending, (state) => { state.status = 'loading'; })
      .addCase(deleteProject.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const deletedProjectId = action.payload;
          // Remove the project from both lists
          state.items = state.items.filter(p => p._id !== deletedProjectId);
          state.myItems = state.myItems.filter(p => p._id !== deletedProjectId);
      })
      .addCase(deleteProject.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload.message || 'Failed to delete project.'; });
  },
});

export default projectsSlice.reducer;