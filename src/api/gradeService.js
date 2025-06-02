import apiClient from "./apiClient"

/**
 * Grade service for handling grade-related operations
 */
const gradeService = {
  /**
   * Get grades for a class and subject
   * @param {number} classId - Class ID
   * @param {number} subjectId - Subject ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with grades data
   */
  getGrades: async (classId, subjectId, params = {}) => {
    try {
      const response = await apiClient.get(`/grades/class/${classId}/subject/${subjectId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch grades" }
    }
  },

  /**
   * Save grades for multiple students
   * @param {Object} gradesData - Grades data
   * @param {number} gradesData.classId - Class ID
   * @param {number} gradesData.subjectId - Subject ID
   * @param {number} gradesData.termId - Term ID
   * @param {number} gradesData.sessionId - Session ID
   * @param {Array} gradesData.grades - Array of student grades
   * @returns {Promise} - Promise with saved grades
   */
  saveGrades: async (gradesData) => {
    try {
      const response = await apiClient.post("/grades", gradesData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to save grades" }
    }
  },

  /**
   * Generate report cards for a class
   * @param {number} classId - Class ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with report cards data
   */
  generateReportCards: async (classId, params = {}) => {
    try {
      const response = await apiClient.get(`/grades/report-cards/class/${classId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate report cards" }
    }
  },

  /**
   * Get a single student's report card
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with report card data
   */
  getStudentReportCard: async (studentId, params = {}) => {
    try {
      const response = await apiClient.get(`/grades/report-card/student/${studentId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch report card" }
    }
  },

  /**
   * Get grade statistics for the school
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with grade statistics
   */
  getGradeStatistics: async (params = {}) => {
    try {
      const response = await apiClient.get("/grades/statistics", { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch grade statistics" }
    }
  },
}

export default gradeService
