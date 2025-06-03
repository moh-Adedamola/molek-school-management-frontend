"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { FileText, Download, Printer, BarChart2, Users, BookOpen } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchReportData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        classes: [
          { id: 1, name: "JSS 1A" },
          { id: 2, name: "JSS 1B" },
          { id: 3, name: "JSS 1C" },
          { id: 4, name: "JSS 2A" },
          { id: 5, name: "JSS 2B" },
          { id: 6, name: "JSS 2C" },
          { id: 7, name: "JSS 3A" },
          { id: 8, name: "JSS 3B" },
          { id: 9, name: "JSS 3C" },
        ],
        subjects: [
          { id: 1, name: "Mathematics" },
          { id: 2, name: "English" },
          { id: 3, name: "Basic Science" },
          { id: 4, name: "Social Studies" },
          { id: 5, name: "Computer Science" },
        ],
        terms: [
          { id: 1, name: "First Term" },
          { id: 2, name: "Second Term" },
          { id: 3, name: "Third Term" },
        ],
        sessions: [
          { id: 1, name: "2021/2022" },
          { id: 2, name: "2022/2023" },
          { id: 3, name: "2023/2024" },
          { id: 4, name: "2024/2025" },
        ],
      })
    }, 500)
  })
}

const fetchSchoolReport = (termId, sessionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock school-wide report data
      resolve({
        summary: {
          totalStudents: 450,
          totalTeachers: 32,
          totalClasses: 18,
          averageAttendance: 92,
          overallPassRate: 78,
        },
        classPerformance: [
          { class: "JSS 1A", averageScore: 72, passRate: 85, studentCount: 35 },
          { class: "JSS 1B", averageScore: 68, passRate: 75, studentCount: 32 },
          { class: "JSS 2A", averageScore: 74, passRate: 88, studentCount: 30 },
          { class: "JSS 2B", averageScore: 65, passRate: 70, studentCount: 33 },
          { class: "JSS 3A", averageScore: 78, passRate: 92, studentCount: 28 },
          { class: "JSS 3B", averageScore: 71, passRate: 80, studentCount: 30 },
        ],
        subjectPerformance: [
          { subject: "Mathematics", averageScore: 65, passRate: 72 },
          { subject: "English", averageScore: 70, passRate: 80 },
          { subject: "Science", averageScore: 68, passRate: 75 },
          { subject: "Social Studies", averageScore: 75, passRate: 85 },
          { subject: "Computer Science", averageScore: 78, passRate: 88 },
        ],
        gradeDistribution: {
          "A+": 52,
          A: 87,
          B: 120,
          C: 95,
          D: 60,
          E: 25,
          F: 11,
        },
        attendanceByClass: [
          { class: "JSS 1A", attendance: 94 },
          { class: "JSS 1B", attendance: 91 },
          { class: "JSS 2A", attendance: 93 },
          { class: "JSS 2B", attendance: 89 },
          { class: "JSS 3A", attendance: 95 },
          { class: "JSS 3B", attendance: 90 },
        ],
      })
    }, 1000)
  })
}

const AdminReports = () => {
  const [terms, setTerms] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedSession, setSelectedSession] = useState("")
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [reportType, setReportType] = useState("school") // school, class, subject, student

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchReportData()
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

  const handleGenerateReport = async () => {
    if (!selectedTerm || !selectedSession) {
      toast.error("Please select both term and session")
      return
    }

    setIsLoading(true)
    try {
      const data = await fetchSchoolReport(selectedTerm, selectedSession)
      setReportData(data)
    } catch (error) {
      console.error("Error generating report:", error)
      toast.error("Failed to generate report")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF or Excel file
    toast.info("This would download the report as a PDF or Excel file in a real application")
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
      <h1 className="text-2xl font-bold mb-6">School Reports</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="school">School-wide Report</option>
              <option value="class">Class Report</option>
              <option value="subject">Subject Report</option>
              <option value="student">Student Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Term</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Session</label>
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

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          >
            <FileText size={18} className="mr-2" />
            {isLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {reportData && reportType === "school" && (
        <div className="bg-white rounded-lg shadow overflow-hidden" id="printable-report">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center print:bg-white">
            <div>
              <h2 className="text-lg font-semibold">School-wide Performance Report</h2>
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

          {/* School Summary */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Users size={18} className="mr-2 text-blue-600" />
              School Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Students</div>
                <div className="text-xl font-bold">{reportData.summary.totalStudents}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Teachers</div>
                <div className="text-xl font-bold">{reportData.summary.totalTeachers}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Classes</div>
                <div className="text-xl font-bold">{reportData.summary.totalClasses}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Avg. Attendance</div>
                <div className="text-xl font-bold">{reportData.summary.averageAttendance}%</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Overall Pass Rate</div>
                <div className="text-xl font-bold">{reportData.summary.overallPassRate}%</div>
              </div>
            </div>
          </div>

          {/* Class Performance */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <BookOpen size={18} className="mr-2 text-blue-600" />
              Class Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pass Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.classPerformance.map((cls, index) => {
                    const attendance = reportData.attendanceByClass.find((a) => a.class === cls.class)?.attendance || 0
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cls.class}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cls.studentCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cls.averageScore}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cls.passRate >= 80
                                ? "bg-green-100 text-green-800"
                                : cls.passRate >= 70
                                  ? "bg-blue-100 text-blue-800"
                                  : cls.passRate >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {cls.passRate}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{attendance}%</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <BookOpen size={18} className="mr-2 text-blue-600" />
              Subject Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pass Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.subjectPerformance.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subject.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.averageScore}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subject.passRate >= 80
                              ? "bg-green-100 text-green-800"
                              : subject.passRate >= 70
                                ? "bg-blue-100 text-blue-800"
                                : subject.passRate >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subject.passRate}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <BarChart2 size={18} className="mr-2 text-blue-600" />
              <h3 className="text-md font-semibold">Grade Distribution</h3>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {Object.entries(reportData.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className="text-sm font-medium">{grade}</div>
                  <div className="text-xs text-gray-500">{count} students</div>
                </div>
              ))}
            </div>
            <div className="h-24 flex items-end space-x-2">
              {Object.entries(reportData.gradeDistribution).map(([grade, count]) => {
                const total = Object.values(reportData.gradeDistribution).reduce((a, b) => a + b, 0)
                const percentage = Math.round((count / total) * 100)
                return (
                  <div key={grade} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full ${
                        grade === "F"
                          ? "bg-red-500"
                          : grade === "E" || grade === "D"
                            ? "bg-yellow-500"
                            : grade === "C"
                              ? "bg-blue-500"
                              : "bg-green-500"
                      }`}
                      style={{ height: `${percentage}%` }}
                    ></div>
                    <div className="text-xs mt-1">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
            <p>Report generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReports
