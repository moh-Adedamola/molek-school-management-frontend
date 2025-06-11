"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { FileText, Download, Printer, BarChart2, TrendingUp, Users, Award, Target } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Academic Reports</h1>
          <p className="text-slate-600">Generate comprehensive performance reports for your classes</p>
        </div>

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
    </div>
  )
}

// Sub-components for better organization
const ReportFilters = ({ data, filters, onChange, onGenerate, isLoading }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
    <div className="flex items-center mb-6">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
        <FileText className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Report Configuration</h2>
        <p className="text-slate-600 text-sm">Select parameters to generate your report</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <SelectInput
        label="Class"
        options={data.classes}
        value={filters.class}
        onChange={(e) => onChange("class", e.target.value)}
        placeholder="Choose class"
      />
      <SelectInput
        label="Subject"
        options={data.subjects}
        value={filters.subject}
        onChange={(e) => onChange("subject", e.target.value)}
        placeholder="Choose subject"
      />
      <SelectInput
        label="Term"
        options={data.terms}
        value={filters.term}
        onChange={(e) => onChange("term", e.target.value)}
        placeholder="Choose term"
      />
      <SelectInput
        label="Session"
        options={data.sessions}
        value={filters.session}
        onChange={(e) => onChange("session", e.target.value)}
        placeholder="Choose session"
      />
    </div>
    
    <div className="flex justify-end">
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        aria-label={isLoading ? "Generating report" : "Generate report"}
      >
        <FileText size={18} className="mr-2" />
        {isLoading ? (
          <span className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Generating...
          </span>
        ) : (
          "Generate Report"
        )}
      </button>
    </div>
  </div>
)

const SelectInput = ({ label, options, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
    >
      <option value="">{placeholder}</option>
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
  const gradeDistribution = ["A", "B", "C", "D", "E", "F"].map(grade => ({
    grade,
    count: students.filter(s => s.grade === grade).length
  }))

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden" id="printable-report">
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
    <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white print:bg-white print:text-black">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-2xl font-bold mb-2">
            {subject?.name} Performance Report
          </h2>
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
              Class: {classInfo?.name}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
              {term?.name}, {session?.name}
            </span>
          </div>
        </div>
        <div className="flex space-x-3 print:hidden">
          <ActionButton
            icon={<Printer size={16} />}
            label="Print"
            onClick={onPrint}
            variant="secondary"
          />
          <ActionButton
            icon={<Download size={16} />}
            label="Export"
            onClick={onDownload}
            variant="primary"
          />
        </div>
      </div>
    </div>
  )
}

const ActionButton = ({ icon, label, onClick, variant = "secondary" }) => {
  const baseClasses = "px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  const variants = {
    primary: "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

const ReportStatistics = ({ stats }) => (
  <div className="p-8 border-b border-slate-100">
    <div className="flex items-center mb-6">
      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-800">Performance Overview</h3>
        <p className="text-slate-600 text-sm">Key metrics and statistics</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard 
        label="Highest Score" 
        value={`${stats.highestScore}%`} 
        icon={<Award className="w-5 h-5" />}
        color="emerald" 
      />
      <StatCard 
        label="Average Score" 
        value={`${stats.averageScore}%`} 
        icon={<Target className="w-5 h-5" />}
        color="blue" 
      />
      <StatCard 
        label="Lowest Score" 
        value={`${stats.lowestScore}%`} 
        icon={<BarChart2 className="w-5 h-5" />}
        color="slate" 
      />
      <StatCard 
        label="Students Passed" 
        value={stats.passCount} 
        icon={<Users className="w-5 h-5" />}
        color="green" 
      />
      <StatCard 
        label="Students Failed" 
        value={stats.failCount} 
        icon={<Users className="w-5 h-5" />}
        color="red" 
      />
      <StatCard 
        label="Pass Rate" 
        value={`${stats.passRate}%`} 
        icon={<TrendingUp className="w-5 h-5" />}
        color="purple" 
      />
    </div>
  </div>
)

const StatCard = ({ label, value, icon, color = "blue" }) => {
  const colorVariants = {
    emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200",
    green: "bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200",
    red: "bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-200",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200",
    slate: "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 border-slate-200"
  }

  return (
    <div className={`${colorVariants[color]} p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <div className="opacity-60">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-70 font-medium">{label}</div>
    </div>
  )
}

const GradeDistributionChart = ({ distribution, totalStudents }) => (
  <div className="p-8 border-b border-slate-100 print:hidden">
    <div className="flex items-center mb-6">
      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
        <BarChart2 className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-800">Grade Distribution</h3>
        <p className="text-slate-600 text-sm">Visual breakdown of student performance</p>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6">
      <div className="h-32 flex items-end space-x-3 mb-4">
        {distribution.map(({ grade, count }) => {
          const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
          const height = Math.max(percentage, count > 0 ? 8 : 0)
          
          const gradeColors = {
            "A": "bg-gradient-to-t from-emerald-400 to-emerald-500",
            "B": "bg-gradient-to-t from-blue-400 to-blue-500",
            "C": "bg-gradient-to-t from-yellow-400 to-yellow-500",
            "D": "bg-gradient-to-t from-orange-400 to-orange-500",
            "E": "bg-gradient-to-t from-red-400 to-red-500",
            "F": "bg-gradient-to-t from-red-500 to-red-600"
          }

          return (
            <div key={grade} className="flex flex-col items-center flex-1 group">
              <div
                className={`w-full ${gradeColors[grade]} rounded-t-lg transition-all duration-500 hover:scale-105 shadow-sm`}
                style={{ height: `${height}%`, minHeight: count ? "8px" : "0" }}
                aria-label={`${count} students with grade ${grade}`}
              />
              <div className="mt-3 text-center">
                <div className="text-sm font-bold text-slate-700">{grade}</div>
                <div className="text-xs text-slate-500">{count} students</div>
                <div className="text-xs text-slate-400">{percentage}%</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

const StudentsTable = ({ students }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <TableHeader>Rank</TableHeader>
          <TableHeader>Student Name</TableHeader>
          <TableHeader>Admission No.</TableHeader>
          <TableHeader>1st CA (15)</TableHeader>
          <TableHeader>2nd CA (15)</TableHeader>
          <TableHeader>Exam (70)</TableHeader>
          <TableHeader>Total (100)</TableHeader>
          <TableHeader>Grade</TableHeader>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {students.map((student, index) => (
          <TableRow key={student.id} student={student} isEven={index % 2 === 0} />
        ))}
      </tbody>
    </table>
  </div>
)

const TableHeader = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
    {children}
  </th>
)

const TableRow = ({ student, isEven }) => {
  const gradeColors = {
    "A": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "B": "bg-blue-100 text-blue-800 border-blue-200",
    "C": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "D": "bg-orange-100 text-orange-800 border-orange-200",
    "E": "bg-red-100 text-red-800 border-red-200",
    "F": "bg-red-200 text-red-900 border-red-300"
  }

  const rowBg = isEven ? "bg-white" : "bg-slate-50/50"

  return (
    <tr className={`${rowBg} hover:bg-blue-50/50 transition-colors duration-150`}>
      <TableCell>
        <div className="flex items-center">
          {student.position <= 3 && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
              student.position === 1 ? 'bg-yellow-100 text-yellow-800' :
              student.position === 2 ? 'bg-gray-100 text-gray-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {student.position}
            </div>
          )}
          {student.position > 3 && (
            <span className="text-slate-600 font-medium">{student.position}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium text-slate-800">{student.name}</TableCell>
      <TableCell className="text-slate-600">{student.admissionNumber}</TableCell>
      <TableCell className="font-mono">{student.test1}</TableCell>
      <TableCell className="font-mono">{student.test2}</TableCell>
      <TableCell className="font-mono">{student.exam}</TableCell>
      <TableCell className="font-bold text-slate-800">{student.total}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${gradeColors[student.grade]}`}>
          {student.grade}
        </span>
      </TableCell>
    </tr>
  )
}

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

const ReportFooter = () => (
  <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-100">
    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-600">
      <p>Report generated on {new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      <p className="mt-2 sm:mt-0">Powered by School Management System</p>
    </div>
  </div>
)

TeacherReports.propTypes = {
  role: PropTypes.string
}

export default TeacherReports