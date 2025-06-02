import apiClient from "./apiClient"

/**
 * Teacher service for handling teacher-related operations
 */
const teacherService = {
  /**
   * Get all teachers
   * @returns {Promise} - Promise with teachers data
   */
  getTeachers: async () => {
    try {
      const response = await apiClient.get("/teachers")
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch teachers" }
    }
  },

  /**
   * Get a single teacher by ID
   * @param {number} id - Teacher ID
   * @returns {Promise} - Promise with teacher data
   */
  getTeacher: async (id) => {
    try {
      const response = await apiClient.get(`/teachers/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch teacher" }
    }
  },

  /**
   * Create a new teacher
   * @param {Object} teacherData - Teacher data
   * @returns {Promise} - Promise with created teacher
   */
  createTeacher: async (teacherData) => {
    try {
      const response = await apiClient.post("/teachers", teacherData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to create teacher" }
    }
  },

  /**
   * Update an existing teacher
   * @param {number} id - Teacher ID
   * @param {Object} teacherData - Updated teacher data
   * @returns {Promise} - Promise with updated teacher
   */
  updateTeacher: async (id, teacherData) => {
    try {
      const response = await apiClient.put(`/teachers/${id}`, teacherData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to update teacher" }
    }
  },

  /**
   * Delete a teacher
   * @param {number} id - Teacher ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteTeacher: async (id) => {
    try {
      const response = await apiClient.delete(`/teachers/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete teacher" }
    }
  },

  /**
   * Get classes assigned to a teacher
   * @param {number} teacherId - Teacher ID
   * @returns {Promise} - Promise with assigned classes
   */
  getAssignedClasses: async (teacherId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/classes`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch assigned classes" }
    }
  },

  /**
   * Get subjects assigned to a teacher
   * @param {number} teacherId - Teacher ID
   * @returns {Promise} - Promise with assigned subjects
   */
  getAssignedSubjects: async (teacherId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/subjects`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch assigned subjects" }
    }
  },
}

export default teacherService
