
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PostProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PostProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
