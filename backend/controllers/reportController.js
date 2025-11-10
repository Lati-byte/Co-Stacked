// backend/controllers/reportController.js

const Report = require('../models/Report');
const Project = require('../models/Project');
const User = require('../models/User'); // Corrected casing
const AdminNotification = require('../models/AdminNotification'); // For admin panel notifications

/**
 * @desc    Create a new content report or support ticket
 * @route   POST /api/reports
 * @access  Private (Logged-in users only)
 */
const createReport = async (req, res) => {
  try {
    const { type, reportedId, reason, comment } = req.body;
    const reporterId = req.user._id;

    if (!reason) {
      return res.status(400).json({ message: 'A reason for the report is required.' });
    }

    let reportPayload = {
      reporter: reporterId,
      reason,
      comment,
    };

    if (type === 'project') {
      if (!reportedId) return res.status(400).json({ message: 'A project ID is required for a project report.' });
      const project = await Project.findById(reportedId);
      if (!project) return res.status(404).json({ message: 'Project to report not found.' });
      reportPayload.reportedProject = reportedId;

      const existingReport = await Report.findOne({ reporter: reporterId, reportedProject: reportedId });
      if (existingReport) {
        return res.status(400).json({ message: 'You have already reported this project.' });
      }

    } else if (type === 'user') {
      if (!reportedId) return res.status(400).json({ message: 'A user ID is required for a user report.' });
      const user = await User.findById(reportedId);
      if (!user) return res.status(404).json({ message: 'User to report not found.' });
      reportPayload.reportedUser = reportedId;

      const existingReport = await Report.findOne({ reporter: reporterId, reportedUser: reportedId });
      if (existingReport) {
        return res.status(400).json({ message: 'You have already reported this user.' });
      }
    } 
    
    const report = await Report.create(reportPayload);

    // --- CREATE ADMIN NOTIFICATION ---
    await AdminNotification.create({
        type: 'NEW_REPORT_SUBMITTED',
        message: `A new report/ticket for "${report.reason}" was submitted by ${req.user.name}.`,
        link: '/reports',
        refId: report._id
    });

    res.status(201).json({ message: 'Your request has been submitted successfully. Our team will get back to you shortly.' });

  } catch (error) {
    console.error(`[CREATE REPORT ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while submitting report.' });
  }
};

module.exports = { createReport };