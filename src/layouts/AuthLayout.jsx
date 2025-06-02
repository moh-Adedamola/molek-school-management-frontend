import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    switch (user.role) {
      // case "super-admin":
      //   return <Navigate to="/super-admin" replace />
      case "admin":
        return <Navigate to="/admin" replace />
      case "teacher":
        return <Navigate to="/teacher" replace />
      case "parent":
        return <Navigate to="/parent" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">MOLEK GROUP OF SCHOOLS</h2>
        <p className="mt-2 text-center text-sm text-gray-600">School Management System</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
