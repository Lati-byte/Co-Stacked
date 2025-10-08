// src/features/messages/messagesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// 1. Import the action from the interestsSlice. This allows this slice
// to react when that action is successful.
import { respondToInterest } from '../interests/interestsSlice';


// ===================================================================
// ASYNC THUNKS
// ===================================================================

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/messages/conversations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to load conversations.');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/messages/${conversationId}`);
      return { conversationId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to load messages.');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/messages/${conversationId}`, { text });
      return response.data; // The new message object from the backend
    } catch (error) {
      return rejectWithValue(error.response.data?.message || 'Failed to send message.');
    }
  }
);

// ===================================================================
// THE MESSAGES SLICE
// ===================================================================

const initialState = {
  conversations: [],
  messagesByConversation: {},
  status: 'idle', // For fetching lists
  sendState: 'idle', // For the state of sending a single message
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetching conversations list
      .addCase(fetchConversations.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      // Cases for fetching messages for a single conversation
      .addCase(fetchMessages.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messagesByConversation[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Cases for sending a new message
      .addCase(sendMessage.pending, (state) => { state.sendState = 'loading'; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendState = 'succeeded';
        const newMessage = action.payload;
        if (state.messagesByConversation[newMessage.conversationId]) {
          state.messagesByConversation[newMessage.conversationId].push(newMessage);
        } else {
          // If for some reason we send a message in a convo we haven't loaded yet
          state.messagesByConversation[newMessage.conversationId] = [newMessage];
        }
      })
      .addCase(sendMessage.rejected, (state, action) => { state.sendState = 'failed'; state.error = action.payload; })

      // 2. === INTER-SLICE REDUCER ===
      // This is the critical new piece of logic.
      // It listens for the `fulfilled` action from the `respondToInterest` thunk.
      .addCase(respondToInterest.fulfilled, (state, action) => {
        // The payload from `respondToInterest` now contains the conversation object
        // if the interest was approved.
        const { conversation } = action.payload;
        if (conversation) {
          // Check if this conversation already exists in our list to avoid duplicates
          const exists = state.conversations.some(c => c._id === conversation._id);
          // If it's a brand new conversation, add it to the top of the list.
          if (!exists) {
            state.conversations.unshift(conversation);
          }
        }
      });
  },
});

export default messagesSlice.reducer;