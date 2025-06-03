"use client"

import { useState, useEffect } from "react"
import { BookOpen, Calendar, GraduationCap, Award } from "lucide-react"
import { toast } from "react-toastify"

// Mock API service
const ParentDashboardService = {
  fetchData: () => new Promise(resolve => {
    setTimeout(() => resolve({
      children: [
        {
          id: 1,
          name: "Tadese Maryam.",
          class: "JSS 2A",
          age: 13,
          gender: "Female",
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
    }), 1000)
  })
}

const ParentDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await ParentDashboardService.fetchData()
        setData(dashboardData)
        setSelectedChild(dashboardData.children[0]) // Default to first child
      } catch (error) {
        console.error("Error loading dashboard:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Track your child's academic progress</p>
      </header>

      {data.children.length > 1 && (
        <ChildSelector
          children={data.children}
          selectedChild={selectedChild}
          onChange={setSelectedChild}
        />
      )}

      <ChildInfo
        child={selectedChild}
        session={data.stats.currentSession}
        term={data.stats.currentTerm}
      />

      <StatsGrid stats={data.stats} />

      <AcademicPerformanceTable grades={data.recentGrades} />
    </div>
  )
}

// Sub-components
const ChildSelector = ({ children, selectedChild, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
    <select
      value={selectedChild?.id}
      onChange={(e) => {
        const child = children.find(c => c.id === Number(e.target.value))
        onChange(child)
      }}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
    >
      {children.map(child => (
        <option key={child.id} value={child.id}>{child.name}</option>
      ))}
    </select>
  </div>
)

const ChildInfo = ({ child, session, term }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 className="text-lg font-semibold">{child.name}</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Class: {child.class}</p>
          <p>Admission: {child.admissionNumber}</p>
        </div>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>Session: {session}</p>
        <p>Term: {term}</p>
      </div>
    </div>
  </div>
)

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatCard
      icon={<Calendar size={24} className="text-blue-600" />}
      label="Attendance Rate"
      value={`${stats.attendanceRate}%`}
      color="blue"
    />
    <StatCard
      icon={<Award size={24} className="text-green-600" />}
      label="Average Grade"
      value={stats.averageGrade}
      color="green"
    />
    <StatCard
      icon={<BookOpen size={24} className="text-purple-600" />}
      label="Subjects"
      value={stats.subjects}
      color="purple"
    />
    <StatCard
      icon={<GraduationCap size={24} className="text-yellow-600" />}
      label="Class Position"
      value={stats.position}
      color="yellow"
    />
  </div>
)

const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600"
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  )
}

const AcademicPerformanceTable = ({ grades }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <TableHeader
      icon={<BookOpen size={20} className="text-blue-600" />}
      title="Recent Academic Performance"
    />

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableColumn>Subject</TableColumn>
            <TableColumn>First CA (15)</TableColumn>
            <TableColumn>Second CA (15)</TableColumn>
            <TableColumn>Exam (70)</TableColumn>
            <TableColumn>Total (100)</TableColumn>
            <TableColumn>Grade</TableColumn>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grades.map(grade => (
            <GradeRow key={grade.id} grade={grade} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const TableHeader = ({ icon, title }) => (
  <div className="p-4 bg-blue-50 border-b border-blue-100">
    <h2 className="text-lg font-semibold flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
  </div>
)

const TableColumn = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
)

const GradeRow = ({ grade }) => {
  const gradeColors = {
    A: "bg-green-100 text-green-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-red-100 text-red-800"
  }

  return (
    <tr>
      <TableCell className="font-medium">{grade.subject}</TableCell>
      <TableCell>{grade.test1}</TableCell>
      <TableCell>{grade.test2}</TableCell>
      <TableCell>{grade.exam}</TableCell>
      <TableCell className="font-medium">{grade.total}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gradeColors[grade.grade]}`}>
          {grade.grade}
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

export default ParentDashboard