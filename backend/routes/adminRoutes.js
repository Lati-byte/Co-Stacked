// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

// 1. Import all necessary controller functions, including the new notification ones.
const { 
    getPlatformStats, 
    registerAdmin, 
    getUsersForAdmin, 
    deleteUserByAdmin, 
    updateUserByAdmin,
    getProjectsForAdmin,
    updateProjectByAdmin,
    deleteProjectByAdmin,
    getReports,
    getTransactions,
    getAdminNotifications,
    markAdminNotificationsAsRead,
    updateReportStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// === Dashboard & Auth Routes ===
router.route('/stats').get(protect, admin, getPlatformStats);
router.route('/register').post(registerAdmin);
router.route('/reports')
  .get(protect, admin, getReports);

router.route('/reports/:id')
  .put(protect, admin, updateReportStatus);
  
// === Transactions Route ===
router.route('/transactions').get(protect, admin, getTransactions);

// === NEW: Admin Notifications Routes ===
router.route('/notifications').get(protect, admin, getAdminNotifications);
router.route('/notifications/mark-read').put(protect, admin, markAdminNotificationsAsRead);

// === User Management Routes ===
router.route('/users').get(protect, admin, getUsersForAdmin);
router
  .route('/users/:id')
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUserByAdmin);

// === Project Management Routes ===
router.route('/projects').get(protect, admin, getProjectsForAdmin);
router
  .route('/projects/:id')
  .put(protect, admin, updateProjectByAdmin)
  .delete(protect, admin, deleteProjectByAdmin);


module.exports = router;