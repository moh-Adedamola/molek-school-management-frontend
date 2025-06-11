"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { FileText, Download, Printer, BarChart2, Users, BookOpen, TrendingUp, Calendar, GraduationCap } from "lucide-react"

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
  const [reportType, setReportType] = useState("school")

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
    toast.info("This would download the report as a PDF or Excel file in a real application")
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">School Reports</h1>
          </div>
          <p className="text-slate-600">Generate comprehensive academic performance reports</p>
        </div>

        {/* Report Configuration Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Report Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Report Type</label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="school">School-wide Report</option>
                  <option value="class">Class Report</option>
                  <option value="subject">Subject Report</option>
                  <option value="student">Student Report</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Select Term</label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
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
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Select Session</label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
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
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <FileText className="h-5 w-5" />
              <span>{isLoading ? "Generating..." : "Generate Report"}</span>
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>}
            </button>
          </div>
        </div>

        {/* Report Content */}
        {reportData && reportType === "school" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden" id="printable-report">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white print:bg-white print:text-black">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">School Performance Report</h2>
                  <div className="flex items-center space-x-4 text-blue-100 print:text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{terms.find((t) => t.id.toString() === selectedTerm)?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>{sessions.find((s) => s.id.toString() === selectedSession)?.name} Academic Session</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 print:hidden">
                  <button
                    onClick={handlePrintReport}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* School Summary Cards */}
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                School Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Students</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Total Teachers</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.summary.totalTeachers}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Total Classes</p>
                      <p className="text-2xl font-bold text-purple-900">{reportData.summary.totalClasses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Avg. Attendance</p>
                      <p className="text-2xl font-bold text-amber-900">{reportData.summary.averageAttendance}%</p>
                    </div>
                    <Calendar className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Overall Pass Rate</p>
                      <p className="text-2xl font-bold text-indigo-900">{reportData.summary.overallPassRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Class Performance Table */}
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Class Performance Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-slate-50 rounded-lg">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider rounded-l-lg">
                        Class
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Pass Rate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider rounded-r-lg">
                        Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.classPerformance.map((cls, index) => {
                      const attendance = reportData.attendanceByClass.find((a) => a.class === cls.class)?.attendance || 0
                      return (
                        <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900">{cls.class}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-700">{cls.studentCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{cls.averageScore}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                cls.passRate >= 80
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : cls.passRate >= 70
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : cls.passRate >= 60
                                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                                      : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {cls.passRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-700">{attendance}%</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Subject Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.subjectPerformance.map((subject, index) => (
                  <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">{subject.subject}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Average Score</span>
                        <span className="font-semibold text-slate-900">{subject.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Pass Rate</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                            subject.passRate >= 80
                              ? "bg-green-100 text-green-800"
                              : subject.passRate >= 70
                                ? "bg-blue-100 text-blue-800"
                                : subject.passRate >= 60
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subject.passRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                Grade Distribution
              </h3>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {Object.entries(reportData.gradeDistribution).map(([grade, count]) => (
                    <div key={grade} className="text-center">
                      <div className="text-lg font-bold text-slate-800">{grade}</div>
                      <div className="text-sm text-slate-600">{count} students</div>
                    </div>
                  ))}
                </div>
                <div className="h-32 flex items-end space-x-4">
                  {Object.entries(reportData.gradeDistribution).map(([grade, count]) => {
                    const total = Object.values(reportData.gradeDistribution).reduce((a, b) => a + b, 0)
                    const percentage = Math.round((count / total) * 100)
                    return (
                      <div key={grade} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            grade === "F"
                              ? "bg-gradient-to-t from-red-500 to-red-400"
                              : grade === "E" || grade === "D"
                                ? "bg-gradient-to-t from-amber-500 to-amber-400"
                                : grade === "C"
                                  ? "bg-gradient-to-t from-blue-500 to-blue-400"
                                  : "bg-gradient-to-t from-green-500 to-green-400"
                          }`}
                          style={{ height: `${Math.max(percentage, 5)}%` }}
                        ></div>
                        <div className="text-xs mt-2 font-medium text-slate-700">{percentage}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Report Footer */}
            <div className="p-4 bg-slate-50 text-center">
              <p className="text-sm text-slate-500">
                Report generated on {new Date().toLocaleDateString()} • School Management System
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReports