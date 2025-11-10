// backend/routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { createReview, getReviewsForUser } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Route to post a new review (protected)
router.route('/').post(protect, createReview);

// Route to get all reviews for a user by their ID (public)
router.route('/user/:id').get(getReviewsForUser);

module.exports = router;