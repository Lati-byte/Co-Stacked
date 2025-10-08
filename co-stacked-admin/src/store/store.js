// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import adminAuthReducer from '../features/auth/adminAuthSlice';
import userManagementReducer from '../features/users/userManagementSlice';
// 1. Import the new reducer
import projectManagementReducer from '../features/projects/projectManagementSlice';
import reportsReducer from '../features/reports/reportsSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    auth: adminAuthReducer,
    userManagement: userManagementReducer,
    // 2. Add the new slice to the store
    projectManagement: projectManagementReducer,
     reports: reportsReducer,
  },
});