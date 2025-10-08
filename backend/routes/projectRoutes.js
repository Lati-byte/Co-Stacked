// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject,
  getMyProjects,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// === Public Routes ===
router.route('/').get(getProjects); // GET /api/projects (gets all projects)

// === Protected Routes ===
router.route('/').post(protect, createProject); // POST /api/projects (creates a project)

// It's important to put specific routes like '/myprojects' before dynamic routes like '/:id'
router.route('/myprojects').get(protect, getMyProjects); // GET /api/projects/myprojects

router
  .route('/:id')
  // We'll add getProjectById later if needed
  .put(protect, updateProject)    // PUT /api/projects/:id (updates a project)
  .delete(protect, deleteProject); // DELETE /api/projects/:id (deletes a project)

module.exports = router;