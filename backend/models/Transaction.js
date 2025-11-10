// backend/models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['subscription', 'profile_boost', 'project_boost'],
    },
    // Store amount in cents to avoid floating point issues
    amountInCents: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'ZAR',
    },
    yocoChargeId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['succeeded', 'failed'],
      default: 'succeeded',
    },
    // Flexible metadata for things like projectId
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;