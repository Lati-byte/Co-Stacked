// backend/models/Review.js

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5,
    },
    comment: { 
      type: String, 
      required: true,
      trim: true,
    },
    // The founder who wrote the review
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The developer who is being reviewed
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The project the collaboration was on
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;