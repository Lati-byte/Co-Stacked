// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// 1. Import all necessary controller functions, including the new verifyEmail
const { 
  registerUser, 
  authUser, 
  getUsers,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  recordProfileView,
  verifyEmail,
  forgotPassword,
  resetPassword,
   cancelSubscription
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// === PUBLIC ROUTES ===
// These routes do not require a token.
router.route('/').get(getUsers);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/verify-email', verifyEmail); 
router.post('/forgot-password', forgotPassword); // <-- ADD
router.put('/reset-password/:token', resetPassword);
router.route('/cancel-subscription').put(protect, cancelSubscription); 

// === PROTECTED ROUTES ===
// These routes require a valid token (the 'protect' middleware).
// Grouping profile-related routes together.
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/profile/change-password').put(protect, changeUserPassword);

// Dynamic routes like ':id' should be placed last to avoid conflicts
// with static routes like '/profile'.
router.route('/:id/view').put(protect, recordProfileView);


module.exports = router;