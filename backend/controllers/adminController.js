// backend/controllers/adminController.js
const User = require('../models/user');
const Project = require('../models/Project');
const Report = require('../models/Report');

/**
 * @desc    Get platform-wide statistics for the admin dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    const newUsersLast7Days = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totalUsers,
      totalProjects,
      newUsersLast7Days,
      revenue: { currentMonth: 0, lastMonth: 0 } // Placeholder for future revenue data
    });

  } catch (error) {
    console.error(`[GET STATS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching platform stats.' });
  }
};

/**
 * @desc    Register a new ADMIN user using a secret key
 * @route   POST /api/admin/register
 * @access  Public (but requires secret key)
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: 'Invalid secret key. Not authorized.' });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'An admin with this email already exists.' });
    }
    
    const user = await User.create({
      name, email, password, role,
      isAdmin: true, // This is the key difference for admin registration
    });

    if (user) {
      res.status(201).json({ message: 'Admin user registered successfully. Please proceed to login.' });
    } else {
      res.status(400).json({ message: 'Invalid admin data provided.' });
    }
  } catch (error) {
    console.error(`[REGISTER ADMIN ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error during admin registration.' });
  }
};

/**
 * @desc    Get all users for the admin panel's user management table
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsersForAdmin = async (req, res) => {
  try {
    // We select '-password' to ensure the hashed password is never sent to the client.
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(`[GET ADMIN USERS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

/**
 * @desc    Update a user's details by their ID (as an Admin)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin; 
    
    const updatedUser = await user.save();
    
    // --- THIS IS THE FIX ---
    // We must send back a complete user object that matches the structure
    // of the objects from `getUsersForAdmin` to avoid frontend errors.
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt, // <-- Send back createdAt
      // Include any other fields the UI might need
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      availability: updatedUser.availability,
      location: updatedUser.location,
    });

  } catch (error) {
    console.error(`[ADMIN UPDATE USER ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating user.' });
  }
};


/**
 * @desc    Delete a user by their ID (as an Admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // A safeguard to prevent an admin from deleting their own account via the UI.
    if (req.user._id.toString() === user._id.toString()) {
        return res.status(400).json({ message: 'Admins cannot delete their own account from this panel.'});
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed successfully.' });
    
  } catch (error) {
    console.error(`[DELETE USER ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
};

// ========================================================
// PROJECT MANAGEMENT CONTROLLERS (NEW)
// ========================================================

/**
 * @desc    Get all projects for the admin panel
 * @route   GET /api/admin/projects
 * @access  Private/Admin
 */
const getProjectsForAdmin = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('founderId', 'name email') // Populate founder details for context
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(`[GET ADMIN PROJECTS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};

/**
 * @desc    Update a project by ID (as Admin)
 * @route   PUT /api/admin/projects/:id
 * @access  Private/Admin
 */
const updateProjectByAdmin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    // An admin can update core text fields or status fields
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    
    // Example: Allow an admin to "feature" a project
    project.isFeatured = req.body.isFeatured ?? project.isFeatured;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(`[ADMIN UPDATE PROJECT ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating project.' });
  }
};

/**
 * @desc    Delete a project by ID (as Admin) for moderation
 * @route   DELETE /api/admin/projects/:id
 * @access  Private/Admin
 */
const deleteProjectByAdmin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project removed successfully.' });
    
  } catch (error) {
    console.error(`[ADMIN DELETE PROJECT ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting project.' });
  }
};

/**
 * @desc    Get all open content reports for moderation
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'open' })
      .populate('reporter', 'name email') // Get details of who reported
      .populate('reportedUser', 'name email') // If a user was reported
      .populate('reportedProject', 'title')  // If a project was reported
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(`[GET REPORTS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching reports.' });
  }
};


module.exports = { 
  // Dashboard & Auth
    getPlatformStats, 
    registerAdmin, 
    // User Management
    getUsersForAdmin, 
    updateUserByAdmin, 
    deleteUserByAdmin,
    // Project Management
    getProjectsForAdmin,
    updateProjectByAdmin,
    deleteProjectByAdmin,
    getReports
};