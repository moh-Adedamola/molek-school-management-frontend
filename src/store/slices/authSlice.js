import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  role: localStorage.getItem("role") || null,
  isLoading: false,
  error: null,
  pendingTeachers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      const user = action.payload.user;
      state.token = action.payload.token;
      state.user = user;
      state.role = user.role;

      // Handle verified status for teachers
      if (user.role.toLowerCase() === "teacher" && !user.verified) {
        state.isAuthenticated = false;
        state.error = "You need to be verified by admin. Contact admin.";
      } else {
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", user.role);
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload.message || action.payload || "Login failed";
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || action.payload || "Registration failed";
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
    setPendingTeachers: (state, action) => {
      state.pendingTeachers = action.payload;
    },
    approveTeacher: (state, action) => {
      state.pendingTeachers = state.pendingTeachers.filter((teacher) => teacher.id !== action.payload);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  setPendingTeachers,
  approveTeacher,
} = authSlice.actions;

export default authSlice.reducer;