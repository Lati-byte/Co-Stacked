// backend/models/Interest.js
const mongoose = require('mongoose');

const interestSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    senderId: { // The developer showing interest
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiverId: { // The founder receiving the interest
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Interest = mongoose.model('Interest', interestSchema);
module.exports = Interest;