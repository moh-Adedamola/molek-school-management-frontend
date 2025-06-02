import { usePermission } from "../hooks/usePermission"

/**
 * Component that conditionally renders children based on user permissions
 *
 * @param {Object} props
 * @param {string} props.permission - The permission required to view the children
 * @param {React.ReactNode} props.children - The content to render if permission is granted
 * @param {React.ReactNode} props.fallback - Optional content to render if permission is denied
 */
const PermissionGate = ({ permission, children, fallback = null }) => {
  const hasPermission = usePermission(permission)

  if (!hasPermission) {
    return fallback
  }

  return <>{children}</>
}

export default PermissionGate
