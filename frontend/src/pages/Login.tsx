
import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-brand-600 mb-2">FriendFlow</h1>
        <p className="text-gray-600">Connect with friends and share your moments</p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Login;
