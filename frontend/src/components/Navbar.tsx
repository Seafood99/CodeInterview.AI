import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Code, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigationBlock } from "../contexts/NavigationBlockContext";

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { blockNavigation } = useNavigationBlock();
  const [pendingAction, setPendingAction] = useState<null | { action: () => Promise<void>; title: string; message: string }>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Unified navigation handler
  const handleNavigation = (to: string | (() => Promise<void>)) => {
    if (blockNavigation) {
      const action = typeof to === 'string' ? 
        () => Promise.resolve(navigate(to)) : 
        to;
      
      setPendingAction({
        action,
        title: t("leaveTitle", "Keluar dari soal?"),
        message: t("leaveMessage", "Kamu belum selesai mengerjakan. Apakah yakin ingin keluar?")
      });
    } else {
      if (typeof to === 'string') {
        navigate(to);
      } else {
        to();
      }
    }
  };

  const handleLanguageSwitch = () => {
    i18n.changeLanguage(i18n.language === "en" ? "id" : "en");
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
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary-600" />
            <button
              onClick={() => handleNavigation("/")}
              className="text-xl font-bold text-gray-900 bg-transparent border-none p-0 m-0 cursor-pointer"
            >
              CodeInterview.Ai
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation("/problems")}
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 bg-transparent border-none p-0 m-0 cursor-pointer"
            >
              Problems
            </button>
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 bg-transparent border-none p-0 m-0 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={handleLanguageSwitch}
              className="px-3 py-1 rounded-md border text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Switch Language"
            >
              {i18n.language === "en" ? "ID" : "EN"}
            </button>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="hidden md:inline text-sm text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={() => handleNavigation(handleLogout)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          {/* Mobile Navigation with animation */}
          <div
            className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-b border-gray-200 py-2 z-50 transition-all duration-300 ease-in-out transform origin-top
              ${isMenuOpen ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'}`}
            aria-hidden={!isMenuOpen}
          >
            {isMenuOpen && (
              <div className="flex flex-col space-y-2 px-4">
                <button
                  onClick={() => {
                    handleNavigation("/problems");
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-primary-600 py-2 transition-colors duration-200"
                >
                  Problems
                </button>
                <button
                  onClick={() => {
                    handleNavigation("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-primary-600 py-2 transition-colors duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLanguageSwitch();
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-md border text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors mb-2"
                  aria-label="Switch Language"
                >
                  {i18n.language === "en" ? "ID" : "EN"}
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                {user && (
                  <button
                    onClick={() => {
                      handleNavigation(handleLogout);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Custom Confirm Modal for navigation block */}
          {pendingAction && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">
                  {pendingAction.title}
                </h2>
                <p className="mb-6">
                  {pendingAction.message}
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => setPendingAction(null)}
                  >
                    {t("cancel", "Batal")}
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={async () => {
                      const action = pendingAction.action;
                      setPendingAction(null);
                      await action();
                    }}
                  >
                    {t("continue", "Lanjutkan")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
// (Removed duplicate/stray JSX after main return block)
};

export default Navbar;
