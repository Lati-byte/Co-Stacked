// backend/controllers/projectController.js

const Project = require('../models/Project'); // Import our Project model

/**
 * @desc    Fetch all projects from the database
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res) => {
  try {
    // 1. Use the Mongoose `find` method on our Project model.
    //    Passing an empty object `{}` means "find all documents".
    // 2. We sort by `createdAt: -1` to get the newest projects first.
    //    This is a very common and useful sorting pattern.
    const projects = await Project.find({}).sort({ createdAt: -1 });

    // 3. Send the found projects back to the client as a JSON response.
    res.json(projects);
  } catch (error) {
    // 4. If something goes wrong with the database query, log the error
    //    and send a 500 Internal Server Error response.
    console.error(`Error fetching projects: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};

// We will add more functions here later, like createProject, getProjectById, etc.
/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (requires authentication)
 */
const createProject = async (req, res) => {
  try {
    const { title, description, skills, compensation, stage, location } = req.body;

    // --- Basic Validation ---
    if (!title || !description || !skills || !compensation || !stage || !location) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // --- Authorization Check ---
    // We can access req.user here because our `protect` middleware added it.
    if (!req.user || req.user.role !== 'founder') {
        return res.status(403).json({ message: 'Forbidden. Only founders can post projects.' });
    }
    
    // Create the new project document
    const project = await Project.create({
      title,
      description,
      // Skills from the form are a comma-separated string, we need to convert to an array
      skillsNeeded: skills.split(',').map(skill => skill.trim()),
      compensation,
      stage,
      location,
      founder: req.user.name, // Get the founder's name from the authenticated user
      founderId: req.user._id, // Link the project to the authenticated user's ID
    });
    
    if (project) {
        res.status(201).json(project); // Send back the newly created project
    } else {
        res.status(400).json({ message: 'Invalid project data.' });
    }
  } catch (error) {
    console.error(`Error in createProject: ${error.message}`);
    res.status(500).json({ message: 'Server error during project creation.' });
  }
};

/**
 * @desc    Get projects for the logged-in user
 * @route   GET /api/projects/myprojects
 * @access  Private
 */
const getMyProjects = async (req, res) => {
  try {
    // req.user is added by the 'protect' middleware. We find all projects
    // where the founderId matches the logged-in user's ID.
    const projects = await Project.find({ founderId: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(`Error in getMyProjects: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching user projects.' });
  }
};


/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res) => {
  try {
    const { title, description, skills, compensation, stage, location } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // CRITICAL: Check if the logged-in user is the owner of the project
    if (project.founderId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to edit this project' });
    }

    // Update fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.compensation = compensation || project.compensation;
    project.stage = stage || project.stage;
    project.location = location || project.location;
    if (skills) {
      project.skillsNeeded = skills.split(',').map(skill => skill.trim());
    }

    const updatedProject = await project.save();
    res.json(updatedProject);

  } catch (error) {
    console.error(`Error in updateProject: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating project.' });
  }
};


/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // CRITICAL: Check if the logged-in user is the owner of the project
    if (project.founderId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this project' });
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project removed successfully' });

  } catch (error) {
    console.error(`Error in deleteProject: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting project.' });
  }
};


// Don't forget to export all the new functions
module.exports = {
  getProjects,
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
};