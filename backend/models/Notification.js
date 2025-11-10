// backend/models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    recipient: { // The user who will receive the notification
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    sender: { // The user who triggered the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
       enum: [
        // Interest-related
        'NEW_INTEREST', 
        'INTEREST_APPROVED', 
        'INTEREST_REJECTED',
        // New types
        'NEW_MESSAGE',
        'SUBSCRIPTION_SUCCESS',
        'BOOST_SUCCESS',
        'NEW_REVIEW'
      ],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // References to other documents related to the notification
    interestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    }
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;