
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define types
type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Mock login function (would be an API call in a real app)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, make an API call to your backend
      // Mock successful login for now
      const mockUserData = {
        id: "1",
        username: email.split("@")[0],
        email,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
        bio: "Welcome to my FriendFlow profile!",
      };
      const mockToken = "mock-jwt-token-xyz123";

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(mockUserData));
      localStorage.setItem("token", mockToken);

      // Update state
      setUser(mockUserData);
      setToken(mockToken);
      
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, make an API call to your backend
      // Mock successful signup for now
      const mockUserData = {
        id: "1",
        username,
        email,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username,
        bio: "",
      };
      const mockToken = "mock-jwt-token-xyz123";

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(mockUserData));
      localStorage.setItem("token", mockToken);

      // Update state
      setUser(mockUserData);
      setToken(mockToken);
      
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
