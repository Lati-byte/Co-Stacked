// backend/controllers/userController.js

const User = require('../models/User');
const AdminNotification = require('../models/AdminNotification');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @desc    Register a new user & send verification email
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, skills, location, availability, portfolioLink } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required fields.' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // 1. Create the user. This saves the initial document to the database.
    const user = await User.create({
      name, email, password, role, bio, 
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [], 
      location, availability, portfolioLink
    });

    // 2. Generate the verification token and expiry date.
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // 3. Update the newly created user with the token information.
    // This is a clean, single operation that prevents the double-save crash.
    await User.findByIdAndUpdate(user._id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // 4. Create an admin notification for the new user.
    await AdminNotification.create({
      type: 'NEW_USER_REGISTERED',
      message: `${user.name} has just signed up as a ${user.role}.`,
      link: `/users`,
      refId: user._id
    });

    const textMessage = `Welcome to CoStacked! Your verification code is: ${verificationToken}\n\nThis code will expire in 10 minutes.`;
    const htmlMessage = `<p>Welcome to CoStacked! Your verification code is: <strong>${verificationToken}</strong></p><p>This code will expire in 10 minutes.</p>`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'CoStacked - Verify Your Email Address',
        text: textMessage,
        html: htmlMessage,
      });
      // 5. Send the successful response to the frontend.
      res.status(201).json({ success: true, message: 'Registration successful! Please check your email for a verification code.' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ message: 'User registered, but could not send verification email. Please try resending.' });
    }

  } catch (error) {
    console.error(`[REGISTER ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not register user.' });
  }
};

/**
 * @desc    Verify user email with OTP
 * @route   POST /api/users/verify-email
 * @access  Public
 */
const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return res.status(400).json({ message: 'Email and token are required.' });
        }
        const user = await User.findOne({ 
            email, 
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        console.error(`[VERIFY EMAIL ERROR]: ${error.message}`);
        res.status(500).json({ message: 'Server error during email verification.' });
    }
};

/**
 * @desc    Authenticate (log in) a user & get a JWT
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isEmailVerified) {
        return res.status(401).json({ 
          message: 'Email not verified. Please check your inbox for a verification code.',
          emailNotVerified: true
        });
      }
      res.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, isAdmin: user.isAdmin },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error(`[AUTH ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not authenticate user.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(`[GET USERS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not fetch users.' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(`[GET PROFILE ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not fetch user profile.' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio ?? user.bio;
      user.availability = req.body.availability ?? user.availability;
      user.location = req.body.location ?? user.location;
      user.portfolioLink = req.body.portfolioLink ?? user.portfolioLink;
      if (typeof req.body.skills === 'string') {
        user.skills = req.body.skills.split(',').map(skill => skill.trim());
      }
      if (req.body.profileVisibility) {
        user.profileVisibility = req.body.profileVisibility;
      }
      if (req.body.notificationEmails) {
        user.notificationEmails = req.body.notificationEmails;
      }
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(`[UPDATE PROFILE ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not update profile.' });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new passwords.' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully.' });
    } else {
      res.status(401).json({ message: 'Incorrect current password.' });
    }
  } catch (error) {
    console.error(`[CHANGE PASSWORD ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

const recordProfileView = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot view your own profile." });
    }
    const viewedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { profileViews: 1 } },
      { new: true }
    ).select('-password');
    if (!viewedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(viewedUser);
  } catch (error) {
    console.error(`[RECORD VIEW ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while recording profile view.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const textMessage = `You have requested a password reset. Please click the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.`;
    const htmlMessage = `<p>You have requested a password reset. Please click the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link is valid for 10 minutes.</p>`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'CoStacked - Password Reset Request',
        text: textMessage,
        html: htmlMessage,
      });
      res.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(emailError);
      res.status(500).json({ message: 'Error sending email. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.isVerified = false;
    const updatedUser = await user.save();
    res.json({ success: true, message: 'Your subscription has been canceled.', user: updatedUser });
  } catch (error) {
    console.error(`[CANCEL SUBSCRIPTION ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while canceling subscription.' });
  }
};

module.exports = {
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
  cancelSubscription,
};