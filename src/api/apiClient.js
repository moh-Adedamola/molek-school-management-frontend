import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token conditionally
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Exclude Authorization header for public endpoints like /auth/register and /auth/login
    if (token && !config.url.includes("/auth/register") && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request config:", config); // Debug log
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;