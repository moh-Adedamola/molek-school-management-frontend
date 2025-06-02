"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, Calendar, ClipboardList } from "lucide-react"
import { toast } from "react-toastify"

// Mock API call - replace with actual API call in production
const fetchTeacherDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          assignedClasses: 3,
          assignedSubjects: 4,
          totalStudents: 120,
          upcomingAssessments: 2,
          currentTerm: "First Term",
          currentSession: "2023/2024",
        },
        recentAttendance: [
          { id: 1, class: "JSS 1A", date: "2023-05-15", present: 28, absent: 2, total: 30 },
          { id: 2, class: "JSS 2B", date: "2023-05-15", present: 25, absent: 5, total: 30 },
          { id: 3, class: "JSS 3A", date: "2023-05-15", present: 32, absent: 0, total: 32 },
        ],
        upcomingAssessments: [
          { id: 1, title: "First Test", class: "JSS 1A", subject: "Mathematics", date: "2023-05-20" },
          { id: 2, title: "First Test", class: "JSS 2B", subject: "English", date: "2023-05-22" },
        ],
      })
    }, 1000)
  })
}

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchTeacherDashboardData()
        setDashboardData(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast.error("Failed to load dashboard data")
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      {/* Current Session Info */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Current Academic Period</h2>
            <p className="text-gray-600">Session: {dashboardData.stats.currentSession}</p>
            <p className="text-gray-600">Term: {dashboardData.stats.currentTerm}</p>
          </div>
          <Calendar size={40} className="text-blue-500" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Assigned Classes</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.assignedClasses}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Assigned Subjects</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.assignedSubjects}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <ClipboardList size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Upcoming Assessments</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.upcomingAssessments}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-lg font-semibold flex items-center">
            <Users size={20} className="mr-2 text-blue-600" />
            Recent Attendance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.present}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.absent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{Math.round((record.present / record.total) * 100)}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Assessments */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-lg font-semibold flex items-center">
            <ClipboardList size={20} className="mr-2 text-blue-600" />
            Upcoming Assessments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.upcomingAssessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assessment.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assessment.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assessment.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
