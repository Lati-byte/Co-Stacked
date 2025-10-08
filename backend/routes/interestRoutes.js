// backend/routes/interestRoutes.js
const express = require('express');
const router = express.Router();

const { 
  createInterest, 
  getReceivedInterests, 
  respondToInterest,
  getSentInterests // We are trying to import this
} = require('../controllers/interestController');
const { protect } = require('../middleware/authMiddleware');

// Add a console.log to see what is ACTUALLY being imported
console.log("Verifying import in interestRoutes.js:", typeof getSentInterests === 'function' ? "getSentInterests is a function." : `getSentInterests is ${typeof getSentInterests}.`);

router.route('/').post(protect, createInterest);
router.route('/received').get(protect, getReceivedInterests);
router.route('/:id/respond').put(protect, respondToInterest);
// The server crashes before it gets here if the import fails
router.route('/sent').get(protect, getSentInterests); 

module.exports = router;