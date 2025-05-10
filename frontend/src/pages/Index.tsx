
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to the appropriate page based on auth status
  if (!isLoading) {
    if (isAuthenticated) {
      return <Navigate to="/home" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
};

export default Index;
