"use client"

import { useState, useEffect } from "react"
import { BookOpen, Calendar, GraduationCap, Award } from "lucide-react"
import { toast } from "react-toastify"

// Mock API call - replace with actual API call in production
const fetchParentDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        children: [
          {
            id: 1,
            name: "John Doe Jr.",
            class: "JSS 2A",
            age: 13,
            gender: "Male",
            admissionNumber: "STD2022001",
          },
        ],
        stats: {
          currentTerm: "First Term",
          currentSession: "2023/2024",
          attendanceRate: 95,
          averageGrade: "B",
          subjects: 9,
          position: "5th",
        },
        recentGrades: [
          { id: 1, subject: "Mathematics", test1: 12, test2: 14, exam: 60, total: 86, grade: "A" },
          { id: 2, subject: "English", test1: 13, test2: 12, exam: 58, total: 83, grade: "B" },
          { id: 3, subject: "Science", test1: 10, test2: 13, exam: 55, total: 78, grade: "B" },
        ],
      })
    }, 1000)
  })
}

const ParentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchParentDashboardData()
        setDashboardData(data)
        setSelectedChild(data.children[0]) // Select first child by default
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
      <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>

      {/* Child Selector */}
      {dashboardData.children.length > 1 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
          <select
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedChild?.id}
            onChange={(e) => {
              const childId = Number.parseInt(e.target.value)
              const child = dashboardData.children.find((c) => c.id === childId)
              setSelectedChild(child)
            }}
          >
            {dashboardData.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Child Info */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold">{selectedChild.name}</h2>
            <p className="text-gray-600">Class: {selectedChild.class}</p>
            <p className="text-gray-600">Admission Number: {selectedChild.admissionNumber}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-600">Session: {dashboardData.stats.currentSession}</p>
            <p className="text-gray-600">Term: {dashboardData.stats.currentTerm}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Attendance Rate</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.attendanceRate}%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Award size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Average Grade</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.averageGrade}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Subjects</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.subjects}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <GraduationCap size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Class Position</p>
              <h3 className="text-2xl font-bold">{dashboardData.stats.position}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Grades */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpen size={20} className="mr-2 text-blue-600" />
            Recent Academic Performance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test 1 (15)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test 2 (15)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam (70)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total (100)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentGrades.map((grade) => (
                <tr key={grade.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{grade.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.test1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.test2}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.exam}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{grade.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        grade.grade === "A"
                          ? "bg-green-100 text-green-800"
                          : grade.grade === "B"
                            ? "bg-blue-100 text-blue-800"
                            : grade.grade === "C"
                              ? "bg-yellow-100 text-yellow-800"
                              : grade.grade === "D"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                      }`}
                    >
                      {grade.grade}
                    </div>
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

export default ParentDashboard
