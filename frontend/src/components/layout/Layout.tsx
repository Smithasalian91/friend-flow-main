
import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={`${isAuthenticated ? "pt-16" : ""} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
