import apiClient from "./apiClient"

/**
 * Attendance service for handling attendance-related operations
 */
const attendanceService = {
  /**
   * Get attendance records for a class
   * @param {number} classId - Class ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} - Promise with attendance data
   */
  getClassAttendance: async (classId, date) => {
    try {
      const response = await apiClient.get(`/attendance/class/${classId}`, {
        params: { date },
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch attendance" }
    }
  },

  /**
   * Save attendance records for a class
   * @param {Object} attendanceData - Attendance data
   * @param {number} attendanceData.classId - Class ID
   * @param {string} attendanceData.date - Date in YYYY-MM-DD format
   * @param {Array} attendanceData.attendance - Array of student attendance records
   * @returns {Promise} - Promise with saved attendance
   */
  saveAttendance: async (attendanceData) => {
    try {
      const response = await apiClient.post("/attendance", attendanceData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to save attendance" }
    }
  },

  /**
   * Get attendance statistics for a class
   * @param {number} classId - Class ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with attendance statistics
   */
  getClassAttendanceStats: async (classId, params = {}) => {
    try {
      const response = await apiClient.get(`/attendance/stats/class/${classId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch attendance statistics" }
    }
  },

  /**
   * Get attendance records for a student
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with student attendance data
   */
  getStudentAttendance: async (studentId, params = {}) => {
    try {
      const response = await apiClient.get(`/attendance/student/${studentId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch student attendance" }
    }
  },

  /**
   * Get attendance statistics for a student
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with student attendance statistics
   */
  getStudentAttendanceStats: async (studentId, params = {}) => {
    try {
      const response = await apiClient.get(`/attendance/stats/student/${studentId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch student attendance statistics" }
    }
  },
}

export default attendanceService
