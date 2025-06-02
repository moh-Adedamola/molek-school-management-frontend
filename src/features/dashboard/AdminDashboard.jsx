"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPendingTeachers, approveTeacher } from "../../store/slices/authSlice"
import { Users, UserCheck, BookOpen, GraduationCap, Calendar } from "lucide-react"
import { toast } from "react-toastify"

// Mock API call - replace with actual API call in production
const fetchDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalStudents: 450,
          totalTeachers: 32,
          totalClasses: 18,
          totalSubjects: 12,
          currentTerm: "First Term",
          currentSession: "2023/2024",
        },
        pendingTeachers: [
          { id: 1, name: "John Doe", email: "john.doe@school.com", appliedDate: "2023-05-15" },
          { id: 2, name: "Jane Smith", email: "jane.smith@school.com", appliedDate: "2023-05-16" },
        ],
      })
    }, 1000)
  })
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const { pendingTeachers } = useSelector((state) => state.auth)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData()
        setStats(data.stats)
        dispatch(setPendingTeachers(data.pendingTeachers))
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast.error("Failed to load dashboard data")
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [dispatch])

  const handleApproveTeacher = async (teacherId) => {
    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 500))

      dispatch(approveTeacher(teacherId))
      toast.success("Teacher approved successfully")
    } catch (error) {
      console.error("Error approving teacher:", error)
      toast.error("Failed to approve teacher")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Current Session Info */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Current Academic Period</h2>
            <p className="text-gray-600">Session: {stats.currentSession}</p>
            <p className="text-gray-600">Term: {stats.currentTerm}</p>
          </div>
          <Calendar size={40} className="text-blue-500" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <GraduationCap size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Teachers</p>
              <h3 className="text-2xl font-bold">{stats.totalTeachers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Classes</p>
              <h3 className="text-2xl font-bold">{stats.totalClasses}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Subjects</p>
              <h3 className="text-2xl font-bold">{stats.totalSubjects}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Teacher Approvals */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-lg font-semibold flex items-center">
            <UserCheck size={20} className="mr-2 text-blue-600" />
            Pending Teacher Approvals
          </h2>
        </div>

        {pendingTeachers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No pending teacher approvals</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{teacher.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{teacher.appliedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleApproveTeacher(teacher.id)}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full mr-2"
                      >
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
