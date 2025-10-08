// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- NEW: Import route files ---
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const interestRoutes = require('./routes/interestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // To accept JSON data in the body

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- NEW: Mount the routers ---
// This tells the app: "For any request that starts with /api/users,
// use the rules defined in the userRoutes file."
app.use('/api/users', userRoutes);

// And "For any request that starts with /api/projects,
// use the rules defined in the projectRoutes file."
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));