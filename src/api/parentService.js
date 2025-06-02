import apiClient from "./apiClient"

/**
 * Parent service for handling parent-related operations
 */
const parentService = {
  /**
   * Get all parents
   * @returns {Promise} - Promise with parents data
   */
  getParents: async () => {
    try {
      const response = await apiClient.get("/parents")
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch parents" }
    }
  },

  /**
   * Get a single parent by ID
   * @param {number} id - Parent ID
   * @returns {Promise} - Promise with parent data
   */
  getParent: async (id) => {
    try {
      const response = await apiClient.get(`/parents/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch parent" }
    }
  },

  /**
   * Create a new parent
   * @param {Object} parentData - Parent data
   * @returns {Promise} - Promise with created parent
   */
  createParent: async (parentData) => {
    try {
      const response = await apiClient.post("/parents", parentData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to create parent" }
    }
  },

  /**
   * Update an existing parent
   * @param {number} id - Parent ID
   * @param {Object} parentData - Updated parent data
   * @returns {Promise} - Promise with updated parent
   */
  updateParent: async (id, parentData) => {
    try {
      const response = await apiClient.put(`/parents/${id}`, parentData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to update parent" }
    }
  },

  /**
   * Delete a parent
   * @param {number} id - Parent ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteParent: async (id) => {
    try {
      const response = await apiClient.delete(`/parents/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete parent" }
    }
  },

  /**
   * Get children of a parent
   * @param {number} parentId - Parent ID
   * @returns {Promise} - Promise with children data
   */
  getChildren: async (parentId) => {
    try {
      const response = await apiClient.get(`/parents/${parentId}/children`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch children" }
    }
  },

  /**
   * Generate parent credentials
   * @param {Object} data - Data for generating credentials
   * @param {number} data.studentId - Student ID
   * @param {string} data.parentEmail - Parent email
   * @returns {Promise} - Promise with generated credentials
   */
  generateCredentials: async (data) => {
    try {
      const response = await apiClient.post("/parents/generate-credentials", data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Failed to generate credentials" }
    }
  },
}

export default parentService
