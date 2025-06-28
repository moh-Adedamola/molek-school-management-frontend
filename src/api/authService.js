import apiClient from "./apiClient"

/**
 * Authentication service for handling user authentication operations
 */
const authService = {
  /**
   * Login a user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} - Promise with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Login failed" }
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration result
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" }
    }
  },

  /**
   * Request password reset for a user
   * @param {string} email - User email
   * @returns {Promise} - Promise with reset request result
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Password reset request failed" }
    }
  },

  /**
   * Reset user password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @returns {Promise} - Promise with reset result
   */
  resetPassword: async (resetData) => {
    try {
      const response = await apiClient.post("/auth/reset-password", resetData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Password reset failed" }
    }
  },

  /**
   * Get pending teacher registrations (admin only)
   * @returns {Promise} - Promise with pending teachers
   */
  getPendingTeachers: async () => {
    try {
      const response = await apiClient.get("/auth/pending-teachers")
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to get pending teachers" }
    }
  },

  /**
   * Approve a teacher registration (admin only)
   * @param {number} teacherId - ID of teacher to approve
   * @returns {Promise} - Promise with approval result
   */
  approveTeacher: async (teacherId) => {
    try {
      const response = await apiClient.post(`/auth/approve-teacher/${teacherId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to approve teacher" }
    }
  },

  /**
   * Reject a teacher registration (admin only)
   * @param {number} teacherId - ID of teacher to reject
   * @returns {Promise} - Promise with rejection result
   */
  rejectTeacher: async (teacherId) => {
    try {
      const response = await apiClient.post(`/auth/reject-teacher/${teacherId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to reject teacher" }
    }
  },
}

export default authService