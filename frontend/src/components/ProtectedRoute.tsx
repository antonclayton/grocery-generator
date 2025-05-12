// components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ProtectedRoute exists to make sure that User cannot access certain routes if they are not authorized
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  // login url (from backend) -> goes to Google's OAuth service -> redirects to frontend home page
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  if (!isAuthenticated) {
    handleLogin();
    return null;
    // return <Navigate to="/" replace />; // Redirect to home or login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
