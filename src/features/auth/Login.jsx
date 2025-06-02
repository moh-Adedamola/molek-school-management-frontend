"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginStart, loginSuccess, loginFailure } from "../../store/slices/authSlice"
import { toast } from "react-toastify"

// Mock API call - replace with actual API call in production
const mockLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock users for testing
      const users = [
        { id: 1, email: "admin@school.com", password: "password", name: "Admin User", role: "admin" },
        {
          id: 2,
          email: "teacher@school.com",
          password: "password",
          name: "Teacher User",
          role: "teacher",
          approved: true,
        },
        {
          id: 3,
          email: "teacher2@school.com",
          password: "password",
          name: "Pending Teacher",
          role: "teacher",
          approved: false,
        },
        { id: 4, email: "parent@school.com", password: "password", name: "Parent User", role: "parent" },
      ]

      const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

      if (user) {
        if (user.role === "teacher" && !user.approved) {
          reject({ message: "Your account is pending approval by an administrator." })
        } else {
          resolve({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token: "mock-jwt-token",
          })
        }
      } else {
        reject({ message: "Invalid email or password" })
      }
    }, 1000)
  })
}

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()

    dispatch(loginStart())

    try {
      const response = await mockLogin({ email, password })
      dispatch(loginSuccess(response))

      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin")
      } else if (response.user.role === "teacher") {
        navigate("/teacher")
      } else if (response.user.role === "parent") {
        navigate("/parent")
      }

      toast.success("Login successful!")
    } catch (error) {
      dispatch(loginFailure(error.message))
      toast.error(error.message)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
