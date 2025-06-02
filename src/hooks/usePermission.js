import { useSelector } from "react-redux"
import { hasPermission } from "../utils/permissions"

/**
 * Custom hook to check if the current user has a specific permission
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const usePermission = (permission) => {
  const { role } = useSelector((state) => state.auth)
  return hasPermission(role, permission)
}

/**
 * Custom hook to check if the current user has any of the specified permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has any of the permissions
 */
export const useAnyPermission = (permissions) => {
  const { role } = useSelector((state) => state.auth)
  return permissions.some((permission) => hasPermission(role, permission))
}

/**
 * Custom hook to check if the current user has all of the specified permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has all of the permissions
 */
export const useAllPermissions = (permissions) => {
  const { role } = useSelector((state) => state.auth)
  return permissions.every((permission) => hasPermission(role, permission))
}
