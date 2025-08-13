import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Code, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLanguageSwitch = () => {
    const newLang = i18n.language === "en" ? "id" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary-600" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              CodeInterview.Ai
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/problems"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              Problems
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>

          {/* User Actions & Language Switch */}
          <div className="flex items-center space-x-4">
            {/* Language Switch Button */}
            <button
              onClick={handleLanguageSwitch}
              className="px-3 py-1 rounded-md border text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors ml-2"
              aria-label="Switch Language"
            >
              {i18n.language === "en" ? "ID" : "EN"}
            </button>
            {loading ? (
              // Show loading state while checking auth
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : user ? (
              // Show user info when authenticated
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              // Show sign in button when not authenticated
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
