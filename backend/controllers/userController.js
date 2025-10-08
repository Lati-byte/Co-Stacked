// backend/controllers/userController.js

const User = require('../models/user'); // Ensure this casing matches your filename
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user with full profile details
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

    const newUserPayload = {
      name, email, password, role,
      bio: bio || '',
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      location: location || '',
      availability: availability || '',
      portfolioLink: portfolioLink || ''
    };

    const user = await User.create(newUserPayload);

    if (user) {
      res.status(201).json({ message: 'User registered successfully. Please proceed to login.' });
    } else {
      res.status(400).json({ message: 'Invalid user data provided.' });
    }
  } catch (error) {
    console.error(`[REGISTER ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not register user.' });
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
      res.json({
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role ,
          isAdmin: user.isAdmin 
        },
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

/**
 * @desc    Get all users for the public browse page
 * @route   GET /api/users
 * @access  Public
 */
const getUsers = async (req, res) => {
  try {
    // We only send back a subset of fields needed for the UserCard to keep data lean.
    const users = await User.find({}).select('name role bio skills availability location avatarUrl');
    res.json(users);
} catch (error) {
    console.error(`[GET USERS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not fetch users.' });
  }
};

/**
 * @desc    Get the profile of the currently logged-in user
 * @route   GET /api/users/profile
 * @access  Private (requires token)
 */
const getUserProfile = async (req, res) => {
  try {
    // The `protect` middleware attaches the user object to req.user
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

/**
 * @desc    Update the profile of the currently logged-in user
 * @route   PUT /api/users/profile
 * @access  Private (requires token)
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // Using `??` (nullish coalescing) allows users to submit an empty string to clear a field.
      user.bio = req.body.bio ?? user.bio;
      user.availability = req.body.availability ?? user.availability;
      user.location = req.body.location ?? user.location;
      user.portfolioLink = req.body.portfolioLink ?? user.portfolioLink;

      // Only update skills if the field is provided in the request
      if (typeof req.body.skills === 'string') {
        user.skills = req.body.skills.split(',').map(skill => skill.trim());
      }

      const updatedUser = await user.save();
      
      // Send back the complete, updated user object for the Redux store to update
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        availability: updatedUser.availability,
        location: updatedUser.location,
        portfolioLink: updatedUser.portfolioLink,
        avatarUrl: updatedUser.avatarUrl,
      });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(`[UPDATE PROFILE ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not update profile.' });
  }
};


module.exports = {
  registerUser,
  authUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
};