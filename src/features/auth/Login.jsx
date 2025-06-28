"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../api/authService";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const credentials = { email, password };
      console.log("Sending login credentials:", credentials); // Debug log
      const response = await authService.login(credentials);
      console.log("Login response:", response);
      const token = response.token; // Extract token
      const user = response.userResponse; // Extract userResponse
      if (!token || !user) throw new Error("Login response missing required data");

      // Store token
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ token, user })); // Pass both token and user to auth slice

      // Redirect based on role
      const role = user.role.toLowerCase();
    console.log("User role:", role, "Verified:", response.userResponse.verified);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "teacher") {
        // Check verified status for teachers
        if (!user.verified) {
          throw new Error("You need to be verified by admin. Contact admin.");
        }
        console.log("Navigating to /teacher")
        navigate("/teacher");
      } else if (role === "parent") {
        navigate("/parent");
      }

      toast.success("Login successful!");
    } catch (error) {
      console.log("Login error:", error.message); // Debug log
      dispatch(loginFailure(error.message));
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
            Sign in to access your school dashboard and manage your activities
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="relative">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === "email" || email ? "text-indigo-500" : "text-slate-400"
              }`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className={`block w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  focusedField === "email"
                    ? "border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === "password" || password ? "text-indigo-500" : "text-slate-400"
              }`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`block w-full pl-12 pr-12 py-3 rounded-xl border transition-all duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  focusedField === "password"
                    ? "border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.657 5.657l1.414 1.414M14.121 14.121l1.414 1.414m-1.414-1.414L14.121 14.121M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-.837 2.54m-2.429 2.429L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-.897 3.111A9.97 9.97 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 01.897-3.111z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white transition-all duration-200 transform ${
              isLoading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-600 to-indigo-600 hover:from-slate-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing you in...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500 font-medium">New to our platform?</span>
          </div>
        </div>

        {/* Register Link */}
        <div>
          <a
            href="/register"
            className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create New Account
          </a>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
      
      .group:hover .group-hover\\:translate-x-1 {
        transform: translateX(0.25rem);
      }
    `}</style>
    <ToastContainer /> {/* Ensure this is present */}
    </>
  );
};

export default Login;