
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "signup";

const AuthForm: React.FC = () => {
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (mode === "signup") {
      if (!formData.username.trim()) {
        toast.error("Username is required");
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.username, formData.email, formData.password);
      }
      
      // Redirect to home on successful auth
      navigate("/home");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };
  
  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === "login" 
            ? "Sign in to access your FriendFlow account"
            : "Join FriendFlow to connect with friends and share moments"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required={mode === "signup"}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={mode === "signup"}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </Button>
          <p className="text-center text-sm">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={toggleMode}
              type="button"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
