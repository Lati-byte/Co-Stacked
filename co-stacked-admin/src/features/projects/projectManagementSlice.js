// src/features/projects/projectManagementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Fetches the complete list of all projects for the admin panel.
 */
export const fetchAllProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

/**
 * Updates a project by its ID. This is an admin-only action.
 */
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/admin/projects/${projectId}`, projectData);
      return response.data; // The updated project object from the backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

/**
 * Deletes a project by its ID. This is an admin-only action.
 */
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/projects/${projectId}`);
      return projectId; // Return the ID of the deleted project
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);


// ===================================================================
// THE PROJECT MANAGEMENT SLICE
// ===================================================================

const initialState = {
  projects: [],
  status: 'idle',
  error: null,
};

const projectManagementSlice = createSlice({
  name: 'projectManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for FETCHING all projects
      .addCase(fetchAllProjects.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // --- NEW: Cases for UPDATING a project ---
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedProject = action.payload;
        // Find the project in our state array and replace it with the updated version
        const projectIndex = state.projects.findIndex(p => p._id === updatedProject._id);
        if (projectIndex !== -1) {
          // It's important to merge, as the updatedProject might not contain populated data
          state.projects[projectIndex] = { ...state.projects[projectIndex], ...updatedProject };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Cases for DELETING a project
      .addCase(deleteProject.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Filter out the deleted project from the state array
        state.projects = state.projects.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export default projectManagementSlice.reducer;