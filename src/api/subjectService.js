import apiClient from "./apiClient"

/**
 * Subject service for handling subject-related operations
 */
const subjectService = {
  /**
   * Get all subjects
   * @returns {Promise} - Promise with subjects data
   */
  getSubjects: async () => {
    try {
      const response = await apiClient.get("/subjects")
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch subjects" }
    }
  },

  /**
   * Get a single subject by ID
   * @param {number} id - Subject ID
   * @returns {Promise} - Promise with subject data
   */
  getSubject: async (id) => {
    try {
      const response = await apiClient.get(`/subjects/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch subject" }
    }
  },

  /**
   * Create a new subject
   * @param {Object} subjectData - Subject data
   * @returns {Promise} - Promise with created subject
   */
  createSubject: async (subjectData) => {
    try {
      const response = await apiClient.post("/subjects", subjectData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to create subject" }
    }
  },

  /**
   * Update an existing subject
   * @param {number} id - Subject ID
   * @param {Object} subjectData - Updated subject data
   * @returns {Promise} - Promise with updated subject
   */
  updateSubject: async (id, subjectData) => {
    try {
      const response = await apiClient.put(`/subjects/${id}`, subjectData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to update subject" }
    }
  },

  /**
   * Delete a subject
   * @param {number} id - Subject ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteSubject: async (id) => {
    try {
      const response = await apiClient.delete(`/subjects/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete subject" }
    }
  },

  /**
   * Assign a teacher to a subject for a specific class
   * @param {number} subjectId - Subject ID
   * @param {number} teacherId - Teacher ID
   * @param {number} classId - Class ID
   * @returns {Promise} - Promise with assignment result
   */
  assignTeacher: async (subjectId, teacherId, classId) => {
    try {
      const response = await apiClient.post(`/subjects/${subjectId}/assign-teacher`, { teacherId, classId })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to assign teacher" }
    }
  },

  /**
   * Get subject performance statistics
   * @param {number} subjectId - Subject ID
   * @param {Object} params - Query parameters (term, session, class, etc.)
   * @returns {Promise} - Promise with subject performance data
   */
  getSubjectPerformance: async (subjectId, params = {}) => {
    try {
      const response = await apiClient.get(`/subjects/${subjectId}/performance`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch subject performance" }
    }
  },
}

export default subjectService
