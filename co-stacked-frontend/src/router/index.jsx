// src/router/index.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import Layouts and Protection
import { MainLayout } from "../components/layout/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute"; // Using the simpler children-based one

// Import All Page Components
import { HomePage } from "../pages/HomePage";
import { DiscoverProjectsPage } from "../pages/DiscoverProjectsPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { BrowseUsersPage } from "../pages/BrowseUsersPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SignUpPage } from "../pages/SignUpPage";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { MessagesPage } from "../pages/MessagesPage";
import { PostProjectPage } from "../pages/PostProjectPage";
import { RequestsPage } from "../pages/RequestsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SupportPage } from "../pages/SupportPage";
import { MyProjectsPage } from "../pages/MyProjectsPage";
import { EditProjectPage } from "../pages/EditProjectPage";
import { SentRequestsPage } from "../pages/SentRequestsPage"; // <-- 1. IMPORT THE NEW PAGE

const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: "/",
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: "/projects",
    element: (
      <MainLayout>
        <DiscoverProjectsPage />
      </MainLayout>
    ),
  },
  {
    path: "/projects/:projectId",
    element: (
      <MainLayout>
        <ProjectDetailPage />
      </MainLayout>
    ),
  },
  {
    path: "/users",
    element: (
      <MainLayout>
        <BrowseUsersPage />
      </MainLayout>
    ),
  },
  {
    path: "/users/:userId",
    element: (
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <MainLayout>
        <SignUpPage />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <MainLayout>
        <LoginPage />
      </MainLayout>
    ),
  },
  {
    path: "/support",
    element: (
      <MainLayout>
        <SupportPage />
      </MainLayout>
    ),
  },
  { path: "my-applications", element: <SentRequestsPage /> },

  // --- PROTECTED ROUTES ---
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-projects",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MyProjectsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/edit/:projectId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditProjectPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <RequestsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "messages",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MessagesPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SettingsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/post-project",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <PostProjectPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // You can add a 404 Not Found Page later
  // {
  //   path: '*',
  //   element: <MainLayout><NotFoundPage /></MainLayout>
  // }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
