"use client"

import { useState } from "react"
import { toast } from "react-toastify"

// Mock API call - replace with actual API call in production
const mockResetPassword = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, this would send a password reset email
      if (email && email.includes("@")) {
        resolve({ success: true })
      } else {
        reject({ message: "Invalid email address" })
      }
    }, 1000)
  })
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await mockResetPassword(email)
      setIsSubmitted(true)
      toast.success("Password reset instructions sent to your email")
    } catch (error) {
      toast.error(error.message || "Failed to send reset instructions")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Check Your Email</h2>
        <p className="mb-4">
          We've sent password reset instructions to <strong>{email}</strong>
        </p>
        <p className="mb-6 text-sm text-gray-600">
          If you don't see the email in your inbox, please check your spam folder.
        </p>
        <a href="/login" className="text-blue-600 hover:underline">
          Return to Login
        </a>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <p className="mb-6 text-gray-600">
        Enter your email address below and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
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

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
