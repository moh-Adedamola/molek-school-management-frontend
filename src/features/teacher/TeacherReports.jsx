"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { FileText, Download, Printer, BarChart2 } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchReportData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        classes: [
          { id: 1, name: "JSS 1A" },
          { id: 2, name: "JSS 2B" },
          { id: 3, name: "JSS 3A" },
        ],
        subjects: [
          { id: 1, name: "Mathematics" },
          { id: 2, name: "English" },
          { id: 3, name: "Science" },
          { id: 4, name: "Social Studies" },
        ],
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

const fetchClassReport = (classId, subjectId, termId, sessionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock report data
      const students = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        admissionNumber: `STD${classId}${i + 1}`,
        test1: Math.floor(Math.random() * 16), // 0-15
        test2: Math.floor(Math.random() * 16), // 0-15
        exam: Math.floor(Math.random() * 71), // 0-70
      }))

      // Calculate total and grade for each student
      const studentsWithGrades = students.map((student) => {
        const total = student.test1 + student.test2 + student.exam
        let grade = ""
        if (total >= 90) grade = "A+"
        else if (total >= 80) grade = "A"
        else if (total >= 70) grade = "B"
        else if (total >= 60) grade = "C"
        else if (total >= 50) grade = "D"
        else if (total >= 40) grade = "E"
        else grade = "F"

        return { ...student, total, grade }
      })

      // Sort by total score (descending)
      studentsWithGrades.sort((a, b) => b.total - a.total)

      // Add position
      const studentsWithPosition = studentsWithGrades.map((student, index) => ({
        ...student,
        position: index + 1,
      }))

      // Calculate statistics
      const totalScores = studentsWithPosition.map((s) => s.total)
      const highestScore = Math.max(...totalScores)
      const lowestScore = Math.min(...totalScores)
      const averageScore = Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
      const passCount = studentsWithPosition.filter((s) => s.total >= 40).length
      const failCount = studentsWithPosition.length - passCount
      const passRate = Math.round((passCount / studentsWithPosition.length) * 100)

      resolve({
        students: studentsWithPosition,
        stats: {
          highestScore,
          lowestScore,
          averageScore,
          passCount,
          failCount,
          passRate,
        },
      })
    }, 1000)
  })
}

const TeacherReports = () => {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [terms, setTerms] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedSession, setSelectedSession] = useState("")
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchReportData()
        setClasses(data.classes)
        setSubjects(data.subjects)
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
    if (!selectedClass || !selectedSubject || !selectedTerm || !selectedSession) {
      toast.error("Please select all required fields")
      return
    }

    setIsLoading(true)
    try {
      const data = await fetchClassReport(selectedClass, selectedSubject, selectedTerm, selectedSession)
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
      <h1 className="text-2xl font-bold mb-6">Generate Reports</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
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

      {reportData && (
        <div className="bg-white rounded-lg shadow overflow-hidden" id="printable-report">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center print:bg-white">
            <div>
              <h2 className="text-lg font-semibold">
                {subjects.find((s) => s.id.toString() === selectedSubject)?.name} Report -{" "}
                {classes.find((c) => c.id.toString() === selectedClass)?.name}
              </h2>
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

          {/* Statistics */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-md font-semibold mb-3">Class Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Highest Score</div>
                <div className="text-xl font-bold">{reportData.stats.highestScore}%</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Lowest Score</div>
                <div className="text-xl font-bold">{reportData.stats.lowestScore}%</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Average Score</div>
                <div className="text-xl font-bold">{reportData.stats.averageScore}%</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Pass Count</div>
                <div className="text-xl font-bold">{reportData.stats.passCount}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Fail Count</div>
                <div className="text-xl font-bold">{reportData.stats.failCount}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Pass Rate</div>
                <div className="text-xl font-bold">{reportData.stats.passRate}%</div>
              </div>
            </div>
          </div>

          {/* Grade Distribution Chart (simplified) */}
          <div className="p-4 border-b border-gray-200 print:hidden">
            <div className="flex items-center mb-3">
              <BarChart2 size={18} className="mr-2 text-blue-600" />
              <h3 className="text-md font-semibold">Grade Distribution</h3>
            </div>
            <div className="h-16 flex items-end space-x-1">
              {["A+", "A", "B", "C", "D", "E", "F"].map((grade) => {
                const count = reportData.students.filter((s) => s.grade === grade).length
                const percentage = Math.round((count / reportData.students.length) * 100) || 0
                return (
                  <div key={grade} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full ${
                        grade === "F" ? "bg-red-500" : grade === "E" || grade === "D" ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ height: `${percentage}%`, minHeight: count ? "4px" : "0" }}
                    ></div>
                    <div className="text-xs mt-1">{grade}</div>
                    <div className="text-xs text-gray-500">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Number
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
                {reportData.students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.test1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.test2}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.exam}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.grade === "A+" || student.grade === "A"
                            ? "bg-green-100 text-green-800"
                            : student.grade === "B"
                              ? "bg-blue-100 text-blue-800"
                              : student.grade === "C"
                                ? "bg-yellow-100 text-yellow-800"
                                : student.grade === "D" || student.grade === "E"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.grade}
                      </div>
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

export default TeacherReports
