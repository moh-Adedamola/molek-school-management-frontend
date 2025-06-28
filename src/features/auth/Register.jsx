"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerStart, registerSuccess, registerFailure } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../api/authService";
import { ToastContainer } from "react-toastify";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("TEACHER"); // Updated to role, default to TEACHER
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(registerStart());

    try {
      const userData = { firstName, lastName, email, password, confirmPassword, role }; // Using role
      console.log("Sending registration data:", userData); // Debug log
      await authService.register(userData);
      dispatch(registerSuccess());

      toast.success("Registration successful! Please log in.");
      if (role === "TEACHER") {
        toast.info("Your account will be reviewed by an administrator before you can log in.");
      }
      navigate("/login");
    } catch (error) {
      console.log("Registration error:", error.message); // Debug log
      dispatch(registerFailure(error.message));
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Join Our Platform
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
            Create your account to access our comprehensive school management system
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                First Name
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "firstName" || firstName ? "text-indigo-500" : "text-slate-400"
                }`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField("")}
                  className={`block w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    focusedField === "firstName"
                      ? "border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
                      : "border-slate-300 hover:border-slate-400 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                  placeholder="John"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                Last Name
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "lastName" || lastName ? "text-indigo-500" : "text-slate-400"
                }`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField("")}
                  className={`block w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    focusedField === "lastName"
                      ? "border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
                      : "border-slate-300 hover:border-slate-400 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

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
                placeholder="you@example.com"
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
                autoComplete="new-password"
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
                placeholder="Create a strong password"
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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === "confirmPassword" || confirmPassword ? "text-indigo-500" : "text-slate-400"
              }`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField("")}
                className={`block w-full pl-12 pr-12 py-3 rounded-xl border transition-all duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  focusedField === "confirmPassword"
                    ? "border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? (
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

          {/* Role Selection */}
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-slate-700">
              Register as
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === "role" ? "text-indigo-500" : "text-slate-400"
              }`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={() => setFocusedField("role")}
                onBlur={() => setFocusedField("")}
                className={`block w-full pl-12 pr-10 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  focusedField === "role"
                    ? "border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500"
                } text-slate-700`}
              >
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> Parent accounts are created by administrators. Teacher accounts require approval before access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Register Button */}
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
                Creating your account...
              </>
            ) : (
              <>
                <span>Create Account</span>
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
            <span className="px-4 bg-white text-slate-500 font-medium">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <div>
          <a
            href="/login"
            className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In Instead
          </a>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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

export default Register;