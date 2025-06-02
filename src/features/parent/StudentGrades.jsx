"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Calendar, Download, Printer, BarChart2 } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchStudentData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        student: {
          id: 1,
          name: "John Doe Jr.",
          class: "JSS 2A",
          admissionNumber: "STD2022001",
        },
        terms: [
          { id: 1, name: "First Term" },
          { id: 2, name: "Second Term" },
          { id: 3, name: "Third Term" },
        ],
        sessions: [
          { id: 1, name: "2022/2023" },
          { id: 2, name: "2023/2024" },
        ],
      })
    }, 500)
  })
}

const fetchAttendanceData = (studentId, termId, sessionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock attendance data
      const startDate = new Date("2023-09-01")
      const endDate = new Date("2023-12-15")

      // Generate dates between start and end date (school days only - Monday to Friday)
      const schoolDays = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        // Only include weekdays (Monday-Friday)
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          schoolDays.push(new Date(currentDate))
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Generate attendance records
      const attendanceRecords = schoolDays.map((date) => {
        // 90% chance of being present
        const isPresent = Math.random() < 0.9
        return {
          date: date.toISOString().split("T")[0],
          status: isPresent ? "present" : "absent",
          reason: isPresent ? "" : ["Sick", "Family emergency", "Other"][Math.floor(Math.random() * 3)],
        }
      })

      // Calculate statistics
      const totalDays = attendanceRecords.length
      const presentDays = attendanceRecords.filter((record) => record.status === "present").length
      const absentDays = totalDays - presentDays
      const attendanceRate = Math.round((presentDays / totalDays) * 100)

      // Group by month for chart data
      const months = ["September", "October", "November", "December"]
      const monthlyAttendance = months.map((month) => {
        const monthRecords = attendanceRecords.filter((record) => {
          const recordDate = new Date(record.date)
          const recordMonth = recordDate.toLocaleString("default", { month: "long" })
          return recordMonth === month
        })

        const monthTotalDays = monthRecords.length
        const monthPresentDays = monthRecords.filter((record) => record.status === "present").length
        const monthRate = monthTotalDays > 0 ? Math.round((monthPresentDays / monthTotalDays) * 100) : 0

        return {
          month,
          totalDays: monthTotalDays,
          presentDays: monthPresentDays,
          absentDays: monthTotalDays - monthPresentDays,
          rate: monthRate,
        }
      })

      resolve({
        attendanceRecords,
        summary: {
          totalDays,
          presentDays,
          absentDays,
          attendanceRate,
        },
        monthlyAttendance,
      })
    }, 1000)
  })
}

const StudentAttendance = () => {
  const [student, setStudent] = useState(null)
  const [terms, setTerms] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedSession, setSelectedSession] = useState("")
  const [attendanceData, setAttendanceData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchStudentData()
        setStudent(data.student)
        setTerms(data.terms)
        setSessions(data.sessions)
        setIsInitialLoading(false)
      } catch (error) {
        console.error("Error loading initial data:", error)
        toast.error("Failed to load initial data")
        setIsInitialLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleViewAttendance = async () => {
    if (!selectedTerm || !selectedSession) {
      toast.error("Please select both term and session")
      return
    }

    setIsLoading(true)
    try {
      const data = await fetchAttendanceData(student.id, selectedTerm, selectedSession)
      setAttendanceData(data)
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast.error("Failed to fetch attendance data")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF
    toast.info("This would download the attendance report as a PDF in a real application")
  }

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Attendance</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">{student.name}</h2>
            <p className="text-gray-600">Class: {student.class}</p>
            <p className="text-gray-600">Admission Number: {student.admissionNumber}</p>
          </div>

          <div className="mt-4 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Term</label>
              <select
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="">Select a term</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Session</label>
              <select
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option value="">Select a session</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleViewAttendance}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          >
            <Calendar size={18} className="mr-2" />
            {isLoading ? "Loading..." : "View Attendance"}
          </button>
        </div>
      </div>

      {attendanceData && (
        <div className="bg-white rounded-lg shadow overflow-hidden" id="printable-attendance-report">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center print:bg-white">
            <div>
              <h2 className="text-lg font-semibold">Attendance Report</h2>
              <p className="text-sm text-gray-600">
                {terms.find((t) => t.id.toString() === selectedTerm)?.name},{" "}
                {sessions.find((s) => s.id.toString() === selectedSession)?.name} Academic Session
              </p>
            </div>
            <div className="flex space-x-2 print:hidden">
              <button
                onClick={handlePrintReport}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md flex items-center text-sm"
              >
                <Printer size={16} className="mr-1" />
                Print
              </button>
              <button
                onClick={handleDownloadReport}
                className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md flex items-center text-sm"
              >
                <Download size={16} className="mr-1" />
                Download
              </button>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-md font-semibold mb-3">Attendance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total School Days</div>
                <div className="text-xl font-bold">{attendanceData.summary.totalDays}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Days Present</div>
                <div className="text-xl font-bold">{attendanceData.summary.presentDays}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Days Absent</div>
                <div className="text-xl font-bold">{attendanceData.summary.absentDays}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Attendance Rate</div>
                <div className="text-xl font-bold">{attendanceData.summary.attendanceRate}%</div>
              </div>
            </div>
          </div>

          {/* Monthly Attendance Chart */}
          <div className="p-4 border-b border-gray-200 print:hidden">
            <div className="flex items-center mb-3">
              <BarChart2 size={18} className="mr-2 text-blue-600" />
              <h3 className="text-md font-semibold">Monthly Attendance</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {attendanceData.monthlyAttendance.map((month) => (
                <div key={month.month} className="text-center">
                  <div className="text-sm font-medium">{month.month}</div>
                  <div className="text-xs text-gray-500">{month.rate}% attendance</div>
                </div>
              ))}
            </div>
            <div className="h-24 flex items-end space-x-2">
              {attendanceData.monthlyAttendance.map((month) => (
                <div key={month.month} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full ${
                      month.rate >= 90
                        ? "bg-green-500"
                        : month.rate >= 80
                          ? "bg-blue-500"
                          : month.rate >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                    style={{ height: `${month.rate}%` }}
                  ></div>
                  <div className="text-xs mt-1">
                    {month.presentDays}/{month.totalDays}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason (if absent)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.reason}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
            <p>Report generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentAttendance
