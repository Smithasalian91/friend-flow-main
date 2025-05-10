
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Define types
export type Comment = {
  id: string;
  text: string;
  creator: {
    id: string;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  creator: {
    id: string;
    username: string;
    profileImage?: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
};

type PostContextType = {
  posts: Post[];
  isLoading: boolean;
  createPost: (postData: {
    title: string;
    description: string;
    image?: string;
    tags: string[];
  }) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  getUserPosts: (userId: string) => Post[];
};

// Create mock data for initial posts
const createMockPosts = (): Post[] => {
  return [
    {
      id: "1",
      title: "Mountain Hiking Adventure",
      description: "Spent the weekend exploring mountain trails. The views were spectacular!",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000",
      tags: ["nature", "adventure", "hiking"],
      creator: {
        id: "2",
        username: "natureexplorer",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=natureexplorer",
      },
      likes: ["3", "4"],
      comments: [
        {
          id: "c1",
          text: "Looks amazing! Where is this?",
          creator: {
            id: "3",
            username: "travellover",
            profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=travellover",
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "2",
      title: "Beach Day with Friends",
      description: "Perfect day at the beach with my closest friends. Memories that will last forever!",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
      tags: ["beach", "friends", "summer"],
      creator: {
        id: "3",
        username: "travellover",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=travellover",
      },
      likes: ["2", "4", "5"],
      comments: [
        {
          id: "c2",
          text: "Such a perfect day!",
          creator: {
            id: "2",
            username: "natureexplorer",
            profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=natureexplorer",
          },
          createdAt: new Date(Date.now() - 43200000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "3",
      title: "City Lights Photography",
      description: "Captured this magical moment in the city last night. The lights, the energy!",
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000",
      tags: ["photography", "city", "nightlife"],
      creator: {
        id: "4",
        username: "urbanphotographer",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=urbanphotographer",
      },
      likes: ["1", "5"],
      comments: [],
      createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];
};

// Create the context
const PostContext = createContext<PostContextType>({
  posts: [],
  isLoading: false,
  createPost: async () => {},
  likePost: async () => {},
  addComment: async () => {},
  deletePost: async () => {},
  getUserPosts: () => [],
});

// Custom hook to use post context
export const usePost = () => useContext(PostContext);

// Post provider component
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(createMockPosts());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Create a new post
  const createPost = async (postData: {
    title: string;
    description: string;
    image?: string;
    tags: string[];
  }) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("User must be logged in to create a post");
      }

      // In a real app, make an API call to your backend
      // Mock creating a post for now
      const newPost: Post = {
        id: Date.now().toString(),
        ...postData,
        creator: {
          id: user.id,
          username: user.username,
          profileImage: user.profileImage,
        },
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      // Add to state
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
      console.error("Create post error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Like a post
  const likePost = async (postId: string) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to like a post");
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const isLiked = post.likes.includes(user.id);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== user.id)
                : [...post.likes, user.id],
            };
          }
          return post;
        })
      );
    } catch (error) {
      toast.error("Failed to like post. Please try again.");
      console.error("Like post error:", error);
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, text: string) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to comment");
      }

      const newComment: Comment = {
        id: `c${Date.now()}`,
        text,
        creator: {
          id: user.id,
          username: user.username,
          profileImage: user.profileImage,
        },
        createdAt: new Date().toISOString(),
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            };
          }
          return post;
        })
      );
      
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment. Please try again.");
      console.error("Add comment error:", error);
    }
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to delete a post");
      }

      // In a real app, verify user is the creator of the post
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post. Please try again.");
      console.error("Delete post error:", error);
    }
  };

  // Get posts for a specific user
  const getUserPosts = (userId: string) => {
    return posts.filter((post) => post.creator.id === userId);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        createPost,
        likePost,
        addComment,
        deletePost,
        getUserPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
