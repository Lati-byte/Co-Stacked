// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectsReducer from '../features/projects/projectsSlice';
import usersReducer from '../features/users/usersSlice';
import interestsReducer from '../features/interests/interestsSlice';
import messagesReducer from '../features/messages/messagesSlice';
import reportsReducer from '../features/reports/reportsSlice'; // <-- 1. IMPORT the new reducer

/**
 * The central Redux store for the main user-facing application.
 *
 * It combines all the different feature slices into a single state tree.
 * The keys in the `reducer` object define the names of the state slices.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    users: usersReducer,
    interests: interestsReducer,
    messages: messagesReducer,
    reports: reportsReducer, // <-- 2. ADD the new slice to the store
  },
});