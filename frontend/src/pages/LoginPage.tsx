import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import AuthLoading from "../components/AuthLoading";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t, i18n } = useTranslation();
  const { signup, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard...");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Form submitted:", {
      isSignUp,
      email: formData.email,
      name: formData.name,
    });

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        console.log("Attempting signup...");
        await signup(formData.email, formData.password, formData.name);
        console.log("Signup successful!");
      } else {
        console.log("Attempting login...");
        await login(formData.email, formData.password);
        console.log("Login successful!");
      }

      // Auto-redirect will happen via useEffect when isAuthenticated changes
      console.log("Auth successful, waiting for redirect...");
    } catch (error: any) {
      console.error("Auth error in LoginPage:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-2 py-1 text-xs border rounded"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("id")}
            className="px-2 py-1 text-xs border rounded"
          >
            ID
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? t("login.createAccount") : t("login.signInToAccount")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp
              ? t("login.alreadyHaveAccount")
              : t("login.dontHaveAccount")}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 font-medium text-primary-600 hover:text-primary-500"
            >
              {isSignUp ? t("login.signIn") : t("login.signUp")}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <label htmlFor="name" className="sr-only">
                  {t("login.fullName")}
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignUp}
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder={t("login.fullName")}
                />
              </div>
            )}

            <div className="relative">
              <label htmlFor="email" className="sr-only">
                {t("login.email")}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder={t("login.email")}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t("login.password")}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder={t("login.password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {isSignUp && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  {t("login.confirmPassword")}
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={isSignUp}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder={t("login.confirmPassword")}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <AuthLoading
                  message={isSignUp ? "Creating account..." : "Signing in..."}
                  size="sm"
                />
              ) : isSignUp ? (
                "Sign up"
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          {!isSignUp && (
            <div className="text-center">
              <Link
                to="/"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
