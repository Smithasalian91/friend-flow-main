
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { usePost } from "@/context/PostContext";
import PostCard from "@/components/post/PostCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileUserType {
  id: string;
  username: string;
  profileImage?: string;
  bio?: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { posts, getUserPosts } = usePost();
  
  // Use the URL parameter ID if available, or the logged-in user's ID
  const profileId = id || (user ? user.id : undefined);
  
  // Find user data (in a real app, you would fetch this from a users API)
  const profileUser = profileId
    ? posts.find((post) => post.creator.id === profileId)?.creator || user
    : user;
  
  // Get posts for this user
  const userPosts = profileId ? getUserPosts(profileId) : [];
  
  // Check if this is the current user's profile
  const isCurrentUser = user && profileUser && user.id === profileUser.id;

  if (!profileUser) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <p className="text-muted-foreground mt-2">This user profile does not exist.</p>
        </div>
      </Layout>
    );
  }

  // Access bio safely with optional chaining and default value
  const userBio = (profileUser as ProfileUserType).bio || "No bio yet";

  return (
    <Layout>
      <div className="py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow">
              <AvatarImage src={profileUser.profileImage} />
              <AvatarFallback className="text-3xl">
                {profileUser.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{profileUser.username}</h1>
              <p className="text-muted-foreground mt-1">
                {userBio}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="text-center">
                  <div className="font-semibold">{userPosts.length}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">0</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">0</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
            
            <div className="md:self-start">
              {isCurrentUser ? (
                <Button variant="outline">Edit Profile</Button>
              ) : (
                <Button>Follow</Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            {isCurrentUser && (
              <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
            )}
            <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {userPosts.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isCurrentUser
                    ? "Your posts will appear here"
                    : `${profileUser.username} hasn't posted anything yet`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {isCurrentUser && (
            <TabsContent value="saved">
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2">No saved posts</h3>
                <p className="text-muted-foreground">
                  Posts you save will appear here
                </p>
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="about">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">About {profileUser.username}</h3>
              <p className="text-muted-foreground">
                {userBio}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
