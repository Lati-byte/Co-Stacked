# Co-Stacked: The Collaborative Project Platform

**Co-Stacked** is a full-stack web platform designed to be the nexus for innovation, connecting ambitious founders with talented developers. Founders can post their project ideas, and developers can browse, connect, and collaborate on building the next big thing.

This repository contains the complete source code for both the **modern React frontend** and the **secure Node.js/Express backend API**.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-deployment-link.com) 
[![My LinkedIn](https://img.shields.io/badge/LinkedIn-Lethabo-blue)](https://www.linkedin.com/in/your-linkedin-url)

---

## 🚀 Key Features

### For Founders:
- **Post & Manage Projects:** A rich form to detail project ideas, required skills, and compensation models.
- **Project Dashboard:** A dedicated dashboard to track posted projects and manage incoming connection requests from developers.
- **Browse Talent:** A searchable and filterable "Find Talent" page to discover developers by skill and location.
- **Monetization:** Options to "boost" projects to the top of the search results for increased visibility.

### For Developers:
- **Discover Projects:** An interactive "Discover" page with advanced search (keyword, location) to find projects that match their interests.
- **Detailed Profiles:** Create and edit detailed profiles showcasing their bio, skills, availability, and portfolio.
- **Connect Securely:** A secure connection flow featuring a Non-Disclosure Agreement (NDA) to protect founder ideas.
- **Reputation System:** A review and 5-star rating system for founders to rate developers they've worked with.
- **Personalized Dashboard:** A tailored dashboard showing the status of sent applications and active collaborations.

### Admin Panel (Separate Application):
- **Platform Analytics:** A dashboard with key metrics like total users, total projects, and new signups.
- **Full CRUD Management:** Secure tables for viewing, editing, and deleting any user or project on the platform for moderation purposes.
- **Content Moderation:** A dedicated queue for reviewing and acting on user-submitted reports.

---

## 🛠️ Tech Stack & Architecture

This project is a modern **MERN Stack** application built with a professional, scalable architecture.

### Frontend (User Application & Admin Panel)
- **Framework:** React 18+ (using Hooks)
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Redux Toolkit (including AsyncThunks for API calls)
- **Styling:** CSS Modules with a global CSS Variable design system (no UI libraries like Material UI or Bootstrap)
- **Animations:** Framer Motion
- **API Communication:** Axios
- **Utilities:** `date-fns` for time formatting, `prop-types` for component validation

### Backend
- **Framework:** Node.js with Express
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) for secure, stateless authentication
- **Security:** `bcryptjs` for password hashing, middleware for route protection (user and admin roles)
- **Architecture:** Organized in a scalable structure (Models, Routes, Controllers, Middleware)

---

## 📸 Screenshots

*(This is a crucial section! Add 3-4 of your best screenshots here to showcase the UI.)*

**Example:**
![Homepage](path/to/your/screenshot-homepage.png)
*Homepage Hero Section*

![Discover Projects](path/to/your/screenshot-discover.png)
*Discover Projects Page with live data*

![Admin Dashboard](path/to/your/screenshot-admin.png)
*The Admin Management Panel*

---

## ⚙️ Setup and Installation

To run this project locally, you will need two terminals.

### Backend Setup:
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the root of /backend
#    and add the following variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5001

# 4. Start the server (with auto-reload using nodemon)
npm run server
```
The backend API will be running on `http://localhost:5001`.

### Frontend Setup (User App):
```bash
# 1. Navigate to the frontend directory
cd co-stacked-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
