// backend/models/Report.js
const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  // Who was reported
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  
  // Who made the report
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  reason: { type: String, required: true },
  comment: { type: String },

  status: {
    type: String,
    enum: ['open', 'resolved', 'dismissed'],
    default: 'open',
  },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;