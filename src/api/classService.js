import apiClient from "./apiClient"

/**
 * Class service for handling class-related operations
 */
const classService = {
  /**
   * Get all classes
   * @returns {Promise} - Promise with classes data
   */
  getClasses: async () => {
    try {
      const response = await apiClient.get("/classes")
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch classes" }
    }
  },

  /**
   * Get a single class by ID
   * @param {number} id - Class ID
   * @returns {Promise} - Promise with class data
   */
  getClass: async (id) => {
    try {
      const response = await apiClient.get(`/classes/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch class" }
    }
  },

  /**
   * Create a new class
   * @param {Object} classData - Class data
   * @returns {Promise} - Promise with created class
   */
  createClass: async (classData) => {
    try {
      const response = await apiClient.post("/classes", classData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to create class" }
    }
  },

  /**
   * Update an existing class
   * @param {number} id - Class ID
   * @param {Object} classData - Updated class data
   * @returns {Promise} - Promise with updated class
   */
  updateClass: async (id, classData) => {
    try {
      const response = await apiClient.put(`/classes/${id}`, classData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to update class" }
    }
  },

  /**
   * Delete a class
   * @param {number} id - Class ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteClass: async (id) => {
    try {
      const response = await apiClient.delete(`/classes/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete class" }
    }
  },

  /**
   * Assign a teacher to a class
   * @param {number} classId - Class ID
   * @param {number} teacherId - Teacher ID
   * @returns {Promise} - Promise with assignment result
   */
  assignTeacher: async (classId, teacherId) => {
    try {
      const response = await apiClient.post(`/classes/${classId}/assign-teacher`, { teacherId })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to assign teacher" }
    }
  },

  /**
   * Get class performance statistics
   * @param {number} classId - Class ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with class performance data
   */
  getClassPerformance: async (classId, params = {}) => {
    try {
      const response = await apiClient.get(`/classes/${classId}/performance`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch class performance" }
    }
  },
}

export default classService
