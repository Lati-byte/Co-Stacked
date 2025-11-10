// backend/models/AdminNotification.js

const mongoose = require('mongoose');

const adminNotificationSchema = mongoose.Schema(
  {
    // No recipient needed, as all notifications are for all admins
    type: {
      type: String,
      required: true,
      enum: [
        'NEW_USER_REGISTERED',
        'NEW_PROJECT_POSTED',
        'NEW_REPORT_SUBMITTED',
        'PAYMENT_SUCCESS',
      ],
    },
    message: {
      type: String,
      required: true,
    },
    link: { // A direct link for the admin to click
      type: String, 
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Optional reference to the document that triggered the notification
    refId: {
      type: mongoose.Schema.Types.ObjectId,
    }
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);
module.exports = AdminNotification;