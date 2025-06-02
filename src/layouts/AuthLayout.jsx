import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white text-center">
          <h1 className="text-2xl font-bold">School Management System</h1>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

