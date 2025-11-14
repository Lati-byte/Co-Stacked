// backend/models/user.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating secure tokens

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { 
      type: String, 
      required: true, 
      // --- THIS IS THE FIX ---
      // Add 'admin' to the list of allowed roles.
      enum: ['developer', 'founder', 'admin'],
      default: 'developer',
    },

    // --- Security & Status Fields ---
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      // For paid subscription
      type: Boolean,
      default: false,
    },
    isBoosted: {
      type: Boolean,
      default: false,
    },
    boostExpiresAt: {
      type: Date,
    },

    // --- NEW & UPDATED VERIFICATION FIELDS ---
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },

    // --- Optional Profile Fields ---
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    availability: { type: String, default: "" },
    location: { type: String, default: "" },
    portfolioLink: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    // --- User Preference Fields ---
    profileVisibility: {
      type: String,
      enum: ["public", "connections-only"],
      default: "public",
    },
    notificationEmails: {
      type: String,
      enum: ["all", "essential", "none"],
      default: "essential",
    },

    // --- Field for Profile Views ---
    profileViews: {
      type: Number,
      default: 0,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Middleware to automatically hash the user's password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to securely compare a provided password with the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- NEW: Method to generate and hash password reset token ---
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token to expire in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed token to be sent via email
};

// Robust export to prevent 'OverwriteModelError' in development environments
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

connections: [
  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
],

connectionRequests: [
  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
],

sentRequests: [
  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
],