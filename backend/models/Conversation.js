// backend/models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
  {
    // Array of user IDs who are part of the conversation
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    // Optional link to the project this conversation is about
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;