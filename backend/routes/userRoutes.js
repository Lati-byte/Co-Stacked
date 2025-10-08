// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// 1. Import ALL necessary controller functions and the protect middleware
const { 
  registerUser, 
  authUser, 
  getUsers,
  getUserProfile,      // <-- IMPORT THIS
  updateUserProfile    // <-- IMPORT THIS
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware'); // <-- IMPORT THE PROTECT MIDDLEWARE

// === PUBLIC ROUTES ===
// These routes can be accessed by anyone.
router.route('/').get(getUsers);    // GET /api/users
router.post('/register', registerUser); // POST /api/users/register
router.post('/login', authUser);        // POST /api/users/login


// === PROTECTED ROUTES ===
// These routes can ONLY be accessed by users who provide a valid JWT.
router
  .route('/profile')
  .get(protect, getUserProfile)      // GET /api/users/profile
  .put(protect, updateUserProfile);     // PUT /api/users/profile


module.exports = router;