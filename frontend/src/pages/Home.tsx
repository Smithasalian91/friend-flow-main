
import React from "react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/post/PostCard";
import { usePost } from "@/context/PostContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Home: React.FC = () => {
  const { posts } = usePost();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Feed</h1>
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Post
            </Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Create your first post or follow friends to see their posts</p>
            <Link to="/create">
              <Button>Create Your First Post</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
