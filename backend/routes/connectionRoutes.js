// backend/routes/connectionRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  cancelSentRequest,
  getConnectionStatus
} = require('../controllers/connectionController');

router.post('/send', protect, sendConnectionRequest);
router.post('/accept', protect, acceptConnectionRequest);
router.post('/decline', protect, declineConnectionRequest);
router.post('/remove', protect, removeConnection);
router.post('/cancel', protect, cancelSentRequest);
router.get('/status/:targetUserId', protect, getConnectionStatus);

module.exports = router;