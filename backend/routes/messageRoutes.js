// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Defines GET /api/messages/conversations
router.route('/conversations').get(protect, getConversations);

// Defines GET /api/messages/:conversationId
router.route('/:conversationId').get(protect, getMessages);

// Defines POST /api/messages/:conversationId
router.route('/:conversationId').post(protect, sendMessage);

module.exports = router;