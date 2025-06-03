"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { FileText, Download, Printer, BarChart2 } from "lucide-react"
import PropTypes from "prop-types"

// Constants for mock data (would come from API in real app)
const MOCK_DATA = {
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
    { id: 3, name: "2024/2025" },
  ],
}

// Mock API functions
const fetchReportData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 500)
  })
}

const generateMockReport = (classId, subjectId, termId, sessionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const students = Array.from({ length: 10 }, (_, i) => {
        const test1 = Math.floor(Math.random() * 16)
        const test2 = Math.floor(Math.random() * 16)
        const exam = Math.floor(Math.random() * 71)
        const total = test1 + test2 + exam

        const grade =
            total >= 80 ? "A" :
              total >= 70 ? "B" :
                total >= 60 ? "C" :
                  total >= 50 ? "D" :
                    total >= 40 ? "E" : "F"

        return {
          id: i + 1,
          name: `Student ${i + 1}`,
          admissionNumber: `STD${classId}${i + 1}`,
          test1,
          test2,
          exam,
          total,
          grade
        }
      })

      const sortedStudents = students
        .sort((a, b) => b.total - a.total)
        .map((student, index) => ({ ...student, position: index + 1 }))

      const totalScores = sortedStudents.map(s => s.total)
      const highestScore = Math.max(...totalScores)
      const lowestScore = Math.min(...totalScores)
      const averageScore = Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
      const passCount = sortedStudents.filter(s => s.total >= 40).length
      const failCount = sortedStudents.length - passCount
      const passRate = Math.round((passCount / sortedStudents.length) * 100)

      resolve({
        students: sortedStudents,
        stats: { highestScore, lowestScore, averageScore, passCount, failCount, passRate }
      })
    }, 1000)
  })
}

const TeacherReports = () => {
  const [filters, setFilters] = useState({
    class: "",
    subject: "",
    term: "",
    session: ""
  })
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState({
    initial: true,
    report: false
  })
  const [dropdownData, setDropdownData] = useState({
    classes: [],
    subjects: [],
    terms: [],
    sessions: []
  })

  // Load initial dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchReportData()
        setDropdownData({
          classes: data.classes,
          subjects: data.subjects,
          terms: data.terms,
          sessions: data.sessions
        })
      } catch (error) {
        toast.error("Failed to load initial data")
        console.error(error)
      } finally {
        setIsLoading(prev => ({ ...prev, initial: false }))
      }
    }

    loadData()
  }, [])

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleGenerateReport = useCallback(async () => {
    if (Object.values(filters).some(val => !val)) {
      toast.error("Please select all required fields")
      return
    }

    setIsLoading(prev => ({ ...prev, report: true }))
    try {
      const data = await generateMockReport(
        filters.class,
        filters.subject,
        filters.term,
        filters.session
      )
      setReportData(data)
    } catch (error) {
      toast.error("Failed to generate report")
      console.error(error)
    } finally {
      setIsLoading(prev => ({ ...prev, report: false }))
    }
  }, [filters])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleDownload = useCallback(() => {
    toast.info("Export functionality would be implemented here")
    // In production: Generate PDF/Excel and trigger download
  }, [])

  if (isLoading.initial) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate Reports</h1>

      <ReportFilters
        data={dropdownData}
        filters={filters}
        onChange={handleFilterChange}
        onGenerate={handleGenerateReport}
        isLoading={isLoading.report}
      />

      {reportData && (
        <ReportViewer
          data={reportData}
          filters={filters}
          dropdownData={dropdownData}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      )}
    </div>
  )
}

// Sub-components for better organization
const ReportFilters = ({ data, filters, onChange, onGenerate, isLoading }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SelectInput
        label="Select Class"
        options={data.classes}
        value={filters.class}
        onChange={(e) => onChange("class", e.target.value)}
      />
      <SelectInput
        label="Select Subject"
        options={data.subjects}
        value={filters.subject}
        onChange={(e) => onChange("subject", e.target.value)}
      />
      <SelectInput
        label="Select Term"
        options={data.terms}
        value={filters.term}
        onChange={(e) => onChange("term", e.target.value)}
      />
      <SelectInput
        label="Select Session"
        options={data.sessions}
        value={filters.session}
        onChange={(e) => onChange("session", e.target.value)}
      />
    </div>
    <div className="mt-6 flex justify-end">
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center transition-colors disabled:opacity-50"
        aria-label={isLoading ? "Generating report" : "Generate report"}
      >
        <FileText size={18} className="mr-2" />
        {isLoading ? (
          <span className="flex items-center">
            <span className="animate-pulse">Generating</span>
          </span>
        ) : (
          "Generate Report"
        )}
      </button>
    </div>
  </div>
)

const SelectInput = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
)

const ReportViewer = ({ data, filters, dropdownData, onPrint, onDownload }) => {
  const { students, stats } = data
  const gradeDistribution = [ "A", "B", "C", "D", "E", "F"].map(grade => ({
    grade,
    count: students.filter(s => s.grade === grade).length
  }))

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" id="printable-report">
      <ReportHeader
        filters={filters}
        dropdownData={dropdownData}
        onPrint={onPrint}
        onDownload={onDownload}
      />

      <ReportStatistics stats={stats} />

      <GradeDistributionChart distribution={gradeDistribution} totalStudents={students.length} />

      <StudentsTable students={students} />

      <ReportFooter />
    </div>
  )
}

const ReportHeader = ({ filters, dropdownData, onPrint, onDownload }) => {
  const subject = dropdownData.subjects.find(s => s.id.toString() === filters.subject)
  const classInfo = dropdownData.classes.find(c => c.id.toString() === filters.class)
  const term = dropdownData.terms.find(t => t.id.toString() === filters.term)
  const session = dropdownData.sessions.find(s => s.id.toString() === filters.session)

  return (
    <div className="p-6 bg-blue-50 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center print:bg-white">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {subject?.name} Report - {classInfo?.name}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {term?.name}, {session?.name} Academic Session
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3 print:hidden">
        <ActionButton
          icon={<Printer size={16} />}
          label="Print"
          onClick={onPrint}
          color="gray"
        />
        <ActionButton
          icon={<Download size={16} />}
          label="Download"
          onClick={onDownload}
          color="green"
        />
      </div>
    </div>
  )
}

const ActionButton = ({ icon, label, onClick, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    green: "bg-green-100 hover:bg-green-200 text-green-700",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-700"
  }

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} px-4 py-2 rounded-md flex items-center text-sm transition-colors`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

const ReportStatistics = ({ stats }) => (
  <div className="p-6 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Statistics</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard label="Highest Score" value={`${stats.highestScore}%`} color="blue" />
      <StatCard label="Lowest Score" value={`${stats.lowestScore}%`} color="blue" />
      <StatCard label="Average Score" value={`${stats.averageScore}%`} color="blue" />
      <StatCard label="Pass Count" value={stats.passCount} color="green" />
      <StatCard label="Fail Count" value={stats.failCount} color="red" />
      <StatCard label="Pass Rate" value={`${stats.passRate}%`} color="purple" />
    </div>
  </div>
)

const StatCard = ({ label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    red: "bg-red-50",
    purple: "bg-purple-50"
  }

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  )
}

const GradeDistributionChart = ({ distribution, totalStudents }) => (
  <div className="p-6 border-b border-gray-200 print:hidden">
    <div className="flex items-center mb-4">
      <BarChart2 size={18} className="mr-2 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-800">Grade Distribution</h3>
    </div>
    <div className="h-20 flex items-end space-x-2">
      {distribution.map(({ grade, count }) => {
        const percentage = Math.round((count / totalStudents) * 100) || 0
        const color =
          grade === "F" ? "bg-red-500" :
            grade === "E" || grade === "D" ? "bg-yellow-500" :
              "bg-green-500"

        return (
          <div key={grade} className="flex flex-col items-center flex-1">
            <div
              className={`w-full ${color} rounded-t-sm transition-all duration-300`}
              style={{ height: `${percentage}%`, minHeight: count ? "4px" : "0" }}
              aria-label={`${count} students with grade ${grade}`}
            />
            <div className="text-xs mt-2 font-medium">{grade}</div>
            <div className="text-xs text-gray-500">{count}</div>
          </div>
        )
      })}
    </div>
  </div>
)

const StudentsTable = ({ students }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>Position</TableHeader>
          <TableHeader>Student Name</TableHeader>
          <TableHeader>Admission No.</TableHeader>
          <TableHeader>First C.A (15)</TableHeader>
          <TableHeader>Second C.A (15)</TableHeader>
          <TableHeader>Exam (70)</TableHeader>
          <TableHeader>Total (100)</TableHeader>
          <TableHeader>Grade</TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students.map((student) => (
          <TableRow key={student.id} student={student} />
        ))}
      </tbody>
    </table>
  </div>
)

const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
)

const TableRow = ({ student }) => {
  const gradeColor = {
    "A+": "bg-green-100 text-green-800",
    "A": "bg-green-100 text-green-800",
    "B": "bg-blue-100 text-blue-800",
    "C": "bg-yellow-100 text-yellow-800",
    "D": "bg-orange-100 text-orange-800",
    "E": "bg-orange-100 text-orange-800",
    "F": "bg-red-100 text-red-800"
  }[student.grade]

  return (
    <tr>
      <TableCell>{student.position}</TableCell>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>{student.admissionNumber}</TableCell>
      <TableCell>{student.test1}</TableCell>
      <TableCell>{student.test2}</TableCell>
      <TableCell>{student.exam}</TableCell>
      <TableCell className="font-medium">{student.total}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gradeColor}`}>
          {student.grade}
        </span>
      </TableCell>
    </tr>
  )
}

const TableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

const ReportFooter = () => (
  <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
    <p>Report generated on {new Date().toLocaleDateString()}</p>
  </div>
)

TeacherReports.propTypes = {
  role: PropTypes.string
}

export default TeacherReports