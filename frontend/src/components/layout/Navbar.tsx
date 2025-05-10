
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, Plus, LogOut, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <span className="text-xl font-bold text-brand-600">FriendFlow</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex items-center flex-1 px-8">
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts and people..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/home" className="text-gray-600 hover:text-brand-600 p-2 rounded-full hover:bg-gray-100">
              <Home className="h-5 w-5" />
            </Link>
            <Link to="/create" className="text-gray-600 hover:text-brand-600 p-2 rounded-full hover:bg-gray-100">
              <Plus className="h-5 w-5" />
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-brand-600 p-2 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-600 hover:text-brand-600 rounded-full hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            
            {user && (
              <Link to="/profile" onClick={closeMenu}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Search in mobile menu */}
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts and people..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Link
              to="/home"
              className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-brand-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              <Home className="mr-3 h-5 w-5" /> Home
            </Link>
            
            <Link
              to="/create"
              className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-brand-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              <Plus className="mr-3 h-5 w-5" /> Create Post
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-brand-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              <User className="mr-3 h-5 w-5" /> Profile
            </Link>
            
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="w-full flex items-center text-gray-600 hover:bg-gray-100 hover:text-brand-600 px-3 py-2 rounded-md text-base font-medium"
            >
              <LogOut className="mr-3 h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
