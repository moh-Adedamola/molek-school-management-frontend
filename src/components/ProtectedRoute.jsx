import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Add this line

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "role:", role, "allowedRole:", allowedRole); // Debug log

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role?.toLowerCase() !== allowedRole.toLowerCase()) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "teacher") {
      return <Navigate to="/teacher" replace />;
    } else if (role === "parent") {
      return <Navigate to="/parent" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;