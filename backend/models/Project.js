// backend/models/Project.js

const mongoose = require('mongoose');

// 1. DEFINE THE PROJECT SCHEMA
const projectSchema = mongoose.Schema(
  {
    // Link to the user who created the project.
    // 'ref: User' tells Mongoose this ID corresponds to a document in the 'User' collection.
    // This allows us to easily "populate" the founder's data later.
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from the beginning and end
    },
    description: {
      type: String,
      required: true,
    },
    skillsNeeded: {
      type: [String], // Defines an array of strings
      required: true,
    },
    compensation: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
      enum: [ // Ensures the value is one of these options
        'Concept', 'Wireframe', 'Prototype', 'MVP Development', 
        'Pre-Alpha', 'Alpha', 'Beta', 'Live'
      ],
      default: 'Concept',
    },
    location: {
      type: String,
      required: true,
    },
    // We keep the founder's name here for quick, non-relational lookups,
    // which is efficient for displaying on cards.
    founder: {
      type: String,
      required: true,
    },
    // --- NEW FIELDS FOR PROJECT BOOSTING ---
    isBoosted: {
      type: Boolean,
      default: false,
    },
    boostExpiresAt: {
      type: Date,
    },
  },
  {
    // Mongoose option to automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);


// 2. CREATE AND EXPORT THE MODEL
// Mongoose compiles our schema into a model, creating a 'projects' collection in MongoDB.
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;