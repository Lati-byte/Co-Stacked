// backend/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      required: true, 
      enum: ['developer', 'founder'] 
    },
    
    // --- New field for admin permissions ---
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // CRITICAL: New users are NOT admins by default.
    },
    
    // --- Optional Profile Fields ---
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    availability: { type: String, default: '' },
    location: { type: String, default: '' },
    portfolioLink: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
  },
  { 
    timestamps: true 
  }
);

// This function automatically hashes the user's password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This method securely compares a provided password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
 return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;