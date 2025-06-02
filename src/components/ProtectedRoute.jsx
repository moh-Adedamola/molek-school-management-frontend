import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    if (role === "admin") {
      return <Navigate to="/admin" replace />
    } else if (role === "teacher") {
      return <Navigate to="/teacher" replace />
    } else if (role === "parent") {
      return <Navigate to="/parent" replace />
    }

    // Fallback to login if role is invalid
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
