import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
// import LoadingSpinner from "./LoadingSpinner" // Assume you have a spinner component

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

  // Add a slight delay to prevent flash of auth page
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user?.role) {
    const roleRoutes = {
      // "super-admin": "/super-admin",
      "admin": "/admin",
      "teacher": "/teacher",
      "parent": "/parent"
    }

    const route = roleRoutes[user.role]
    if (route) return <Navigate to={route} replace />
  }

  // Show loading spinner while checking auth state
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo/Image would be better here if available */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            MGS
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
          MOLEK GROUP OF SCHOOLS
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
          School Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-xl sm:px-10 border border-gray-100">
          <Outlet />
        </div>

        {/* Optional footer links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout