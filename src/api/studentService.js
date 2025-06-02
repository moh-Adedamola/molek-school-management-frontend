import apiClient from "./apiClient"

/**
 * Student service for handling student-related operations
 */
const studentService = {
  /**
   * Get all students with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with students data
   */
  getStudents: async (params = {}) => {
    try {
      const response = await apiClient.get("/students", { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch students" }
    }
  },

  /**
   * Get students by class
   * @param {number} classId - Class ID
   * @returns {Promise} - Promise with students data
   */
  getStudentsByClass: async (classId) => {
    try {
      const response = await apiClient.get(`/students/class/${classId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch students by class" }
    }
  },

  /**
   * Get a single student by ID
   * @param {number} id - Student ID
   * @returns {Promise} - Promise with student data
   */
  getStudent: async (id) => {
    try {
      const response = await apiClient.get(`/students/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch student" }
    }
  },

  /**
   * Create a new student
   * @param {Object} studentData - Student data
   * @returns {Promise} - Promise with created student
   */
  createStudent: async (studentData) => {
    try {
      const response = await apiClient.post("/students", studentData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to create student" }
    }
  },

  /**
   * Update an existing student
   * @param {number} id - Student ID
   * @param {Object} studentData - Updated student data
   * @returns {Promise} - Promise with updated student
   */
  updateStudent: async (id, studentData) => {
    try {
      const response = await apiClient.put(`/students/${id}`, studentData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to update student" }
    }
  },

  /**
   * Delete a student
   * @param {number} id - Student ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteStudent: async (id) => {
    try {
      const response = await apiClient.delete(`/students/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete student" }
    }
  },

  /**
   * Get student grades
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with student grades
   */
  getStudentGrades: async (studentId, params = {}) => {
    try {
      const response = await apiClient.get(`/students/${studentId}/grades`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch student grades" }
    }
  },

  /**
   * Get student attendance
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (term, session, etc.)
   * @returns {Promise} - Promise with student attendance
   */
  getStudentAttendance: async (studentId, params = {}) => {
    try {
      const response = await apiClient.get(`/students/${studentId}/attendance`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch student attendance" }
    }
  },
}

export default studentService
