
import React from "react";
import Layout from "@/components/layout/Layout";
import PostForm from "@/components/post/PostForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const CreatePost: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="py-8 flex justify-center">
        <PostForm />
      </div>
    </Layout>
  );
};

export default CreatePost;
