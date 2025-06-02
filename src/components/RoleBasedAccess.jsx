import { useSelector } from "react-redux"

// This component demonstrates how role-based access is implemented
// It can be used to conditionally render UI elements based on user role
export const RoleBasedAccess = ({ children, allowedRoles }) => {
  const { role } = useSelector((state) => state.auth)

  // If no specific roles are required or user's role is in the allowed roles
  if (!allowedRoles || allowedRoles.includes(role)) {
    return <>{children}</>
  }

  // Return null if user doesn't have permission
  return null
}

// Example usage:
// <RoleBasedAccess allowedRoles={["admin"]}>
//   <AdminOnlyFeature />
// </RoleBasedAccess>
