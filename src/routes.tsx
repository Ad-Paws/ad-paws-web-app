import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/authentication/login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Guests from "./pages/guests/Guests";
import Owners from "./pages/owners/Owners";
import Services from "./pages/services/Services";
import ClientSignup from "./pages/authentication/ClientSignup";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/inicio" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inicio",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Dashboard,
      },
    ],
  },
  {
    path: "/visitantes-perrunos",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Guests,
      },
    ],
  },
  {
    path: "/servicios",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Services,
      },
    ],
  },
  {
    path: "/propietarios",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Owners,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthenticationLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        Component: Login,
      },
    ],
  },
  {
    path: "/registro-cliente",
    element: (
      <PublicRoute>
        <ClientSignup />
      </PublicRoute>
    ),
    children: [
      {
        path: "",
        Component: ClientSignup,
      },
    ],
  },
]);
