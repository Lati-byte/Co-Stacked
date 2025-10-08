// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure this matches your file's casing

/**
 * This middleware function checks for a valid JWT in the request headers.
 * If the token is valid, it attaches the authenticated user's data to the request object.
 * If not, it sends back an authorization error.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the 'Authorization' header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOiJIUz...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID embedded in the token and attach it to the request object.
      // We exclude the password field from being attached.
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to the next step in the request-response cycle
      next();
    } catch (error) {
      console.error('Token verification failed', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
    // `req.user` is attached by the preceding `protect` middleware.
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed to the next function.
    } else {
        res.status(403).json({ message: 'Forbidden: Not authorized as an administrator.' });
    }
};

module.exports = { protect, admin };