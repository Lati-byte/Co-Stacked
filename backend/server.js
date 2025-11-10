// backend/server.js

// --- 1. DEPENDENCY IMPORTS ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- 2. ROUTE IMPORTS ---
// Modular routing: Each feature of the API has its own dedicated route file.
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const interestRoutes = require('./routes/interestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


// --- 3. INITIAL CONFIGURATION ---
// Load environment variables from the .env file into process.env
dotenv.config();

// Initiate the connection to the MongoDB database
connectDB();


// --- 4. EXPRESS APP INITIALIZATION ---
const app = express();


// --- 5. CORE MIDDLEWARE ---
// Enable Cross-Origin Resource Sharing (CORS) to allow your frontend
// to make requests to this backend from a different origin (URL).
app.use(cors());

// Enable the Express app to parse incoming request bodies with JSON payloads.
// This is essential for handling POST and PUT requests.
app.use(express.json());


// --- 6. API ROUTE MOUNTING ---
// A simple health-check endpoint to confirm the API is running.
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Mount the modular routers on their respective API base paths.
// For example, any request starting with '/api/users' will be handled by userRoutes.
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// In the future, we would add centralized error handling middleware here.
// e.g., app.use(notFound); app.use(errorHandler);


// --- 7. SERVER STARTUP ---
// Use the port from environment variables for deployment, with a fallback for local dev.
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));