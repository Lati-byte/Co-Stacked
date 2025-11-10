// backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNotifications);
router.route('/mark-read').put(protect, markAsRead);

module.exports = router;