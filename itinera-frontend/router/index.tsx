import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import TripsPage from "../pages/TripsPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/trip",
    element: (
      <ProtectedRoute>
        <TripsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
