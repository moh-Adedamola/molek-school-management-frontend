import apiClient from "./apiClient"

/**
 * Report service for handling report-related operations
 */
const reportService = {
  /**
   * Generate school-wide report
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with school report data
   */
  getSchoolReport: async (params = {}) => {
    try {
      const response = await apiClient.get("/reports/school", { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate school report" }
    }
  },

  /**
   * Generate class report
   * @param {number} classId - Class ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with class report data
   */
  getClassReport: async (classId, params = {}) => {
    try {
      const response = await apiClient.get(`/reports/class/${classId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate class report" }
    }
  },

  /**
   * Generate subject report
   * @param {number} subjectId - Subject ID
   * @param {Object} params - Query parameters (term, session, class, etc.)
   * @returns {Promise} - Promise with subject report data
   */
  getSubjectReport: async (subjectId, params = {}) => {
    try {
      const response = await apiClient.get(`/reports/subject/${subjectId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate subject report" }
    }
  },

  /**
   * Generate student report card
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with student report card data
   */
  getStudentReportCard: async (studentId, params = {}) => {
    try {
      const response = await apiClient.get(`/reports/student/${studentId}/report-card`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate student report card" }
    }
  },

  /**
   * Generate attendance report
   * @param {Object} params - Query parameters (class, term, session, etc.)
   * @returns {Promise} - Promise with attendance report data
   */
  getAttendanceReport: async (params = {}) => {
    try {
      const response = await apiClient.get("/reports/attendance", { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate attendance report" }
    }
  },

  /**
   * Export report as PDF
   * @param {string} reportType - Type of report (school, class, subject, student, attendance)
   * @param {Object} params - Query parameters for the report
   * @returns {Promise} - Promise with PDF data
   */
  exportReportAsPdf: async (reportType, params = {}) => {
    try {
      const response = await apiClient.get(`/reports/export/${reportType}/pdf`, {
        params,
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to export report as PDF" }
    }
  },

  /**
   * Export report as Excel
   * @param {string} reportType - Type of report (school, class, subject, student, attendance)
   * @param {Object} params - Query parameters for the report
   * @returns {Promise} - Promise with Excel data
   */
  exportReportAsExcel: async (reportType, params = {}) => {
    try {
      const response = await apiClient.get(`/reports/export/${reportType}/excel`, {
        params,
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to export report as Excel" }
    }
  },
}

export default reportService
