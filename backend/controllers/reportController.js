// backend/controllers/reportController.js
const Report = require('../models/Report');
const Project = require('../models/Project');

/**
 * @desc    Create a new content report
 * @route   POST /api/reports
 * @access  Private (Logged-in users only)
 */
const createReport = async (req, res) => {
  try {
    const { type, reportedId, reason, comment } = req.body;
    const reporterId = req.user._id; // from `protect` middleware

    if (!type || !reportedId || !reason) {
      return res.status(400).json({ message: 'Type, ID, and reason are required.' });
    }

    let reportPayload = {
      reporter: reporterId,
      reason,
      comment,
    };

    if (type === 'project') {
      const project = await Project.findById(reportedId);
      if (!project) return res.status(404).json({ message: 'Project to report not found.' });
      reportPayload.reportedProject = reportedId;
    } else if (type === 'user') {
      // Logic for reporting a user would go here
    } else {
      return res.status(400).json({ message: 'Invalid report type.' });
    }
    
    // Check if this user has already reported this specific item
    const existingReport = await Report.findOne({ reporter: reporterId, reportedProject: reportedId });
    if (existingReport) {
        return res.status(400).json({ message: 'You have already reported this item.' });
    }

    const report = await Report.create(reportPayload);
    res.status(201).json({ message: 'Report submitted successfully. Thank you for helping keep our community safe.' });

  } catch (error) {
    console.error(`[CREATE REPORT ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while submitting report.' });
  }
};

module.exports = { createReport };