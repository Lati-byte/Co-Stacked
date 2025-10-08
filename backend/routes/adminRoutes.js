// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

// 1. Import ALL necessary controller functions, including the new project management ones.
const { 
    getPlatformStats, 
    registerAdmin, 
    getUsersForAdmin, 
    deleteUserByAdmin, 
    updateUserByAdmin,
    getProjectsForAdmin,
    updateProjectByAdmin,
    deleteProjectByAdmin,
    getReports
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// === Dashboard & Auth Routes ===
router.route('/stats').get(protect, admin, getPlatformStats);
router.route('/register').post(registerAdmin);
router.route('/reports').get(protect, admin, getReports);


// === User Management Routes ===
// Handles GET /api/admin/users
router.route('/users').get(protect, admin, getUsersForAdmin);

// Handles PUT and DELETE for /api/admin/users/:id
router
  .route('/users/:id')
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUserByAdmin);


// === NEW: Project Management Routes ===
// Handles GET /api/admin/projects
router.route('/projects').get(protect, admin, getProjectsForAdmin);

// Handles PUT and DELETE for /api/admin/projects/:id
router
  .route('/projects/:id')
  .put(protect, admin, updateProjectByAdmin)
  .delete(protect, admin, deleteProjectByAdmin);


module.exports = router;