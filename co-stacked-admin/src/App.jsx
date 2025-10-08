// src/App.jsx
import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Import our new, separated Protected Route component
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import { getAdminProfile } from "./features/auth/adminAuthSlice";

// Import Layouts and Pages
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminRegisterPage } from "./pages/AdminRegisterPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { ProjectManagementPage } from "./pages/ProjectManagementPage";
import { ReportsPage } from "./pages/ReportsPage";

// Router configuration is defined at the top level
const router = createBrowserRouter([
  {
    path: "/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/register",
    element: <AdminRegisterPage />,
  },
  {
    path: "/",
    // Use AdminProtectedRoute as the wrapper for all protected routes
    element: <AdminProtectedRoute />,
    children: [
      {
        // This parent provides the sidebar layout to all its children
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          {
            index: true, // Default page at '/'
            element: <AdminDashboardPage />,
          },
          {
            path: "users",
            element: <UserManagementPage />,
          },
          {
            path: "projects",
            element: <ProjectManagementPage />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // This effect runs once when the app loads
  useEffect(() => {
    // If we find an adminToken in localStorage (via our initial Redux state),
    // we dispatch an action to verify it and fetch the admin's profile.
    if (token) {
      dispatch(getAdminProfile());
    }
  }, [dispatch, token]);

  return <RouterProvider router={router} />;
}

export default App;
