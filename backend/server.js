// backend/server.js

// --- 1. DEPENDENCY IMPORTS ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- THIS IS THE FIX ---
// Only load environment variables from the .env file if we are in development mode.
// In production (like on Render), variables will be loaded from the host environment.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// --- 2. ROUTE IMPORTS ---
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
connectDB();


// --- 4. EXPRESS APP INITIALIZATION ---
const app = express();


// --- 5. CORE MIDDLEWARE ---
// Production-ready CORS configuration
const allowedOrigins = [
    'http://localhost:5173', // Your local user-frontend
    'http://localhost:3000', // Your local admin-dashboard
    process.env.FRONTEND_URL, // Your LIVE user-frontend URL from .env
    process.env.ADMIN_URL    // Your LIVE admin-dashboard URL (you should add this to Render)
].filter(Boolean); // Filter out undefined values if they are not set

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());


// --- 6. API ROUTE MOUNTING ---
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);


// --- 7. SERVER STARTUP ---
// Render provides its own PORT environment variable.
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));