// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Conversation',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;