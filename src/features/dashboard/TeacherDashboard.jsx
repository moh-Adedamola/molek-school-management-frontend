"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, Calendar, ClipboardList } from "lucide-react"
import { toast } from "react-toastify"

// Mock API service
const DashboardService = {
  fetchData: () => new Promise(resolve => {
    setTimeout(() => resolve({
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
    }), 1000)
  })
}

const TeacherDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await DashboardService.fetchData()
        setData(dashboardData)
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
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Overview of your teaching activities</p>
      </header>

      <AcademicPeriodInfo
        session={data.stats.currentSession}
        term={data.stats.currentTerm}
      />

      <StatsGrid stats={data.stats} />

      <RecentAttendanceTable records={data.recentAttendance} />

      <UpcomingAssessmentsTable assessments={data.upcomingAssessments} />
    </div>
  )
}

// Sub-components
const AcademicPeriodInfo = ({ session, term }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">Current Academic Period</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Session: {session}</p>
          <p>Term: {term}</p>
        </div>
      </div>
      <Calendar size={40} className="text-blue-500" />
    </div>
  </div>
)

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatCard
      icon={<BookOpen size={24} className="text-blue-600" />}
      label="Assigned Classes"
      value={stats.assignedClasses}
      color="blue"
    />
    <StatCard
      icon={<BookOpen size={24} className="text-green-600" />}
      label="Assigned Subjects"
      value={stats.assignedSubjects}
      color="green"
    />
    <StatCard
      icon={<Users size={24} className="text-purple-600" />}
      label="Total Students"
      value={stats.totalStudents}
      color="purple"
    />
    <StatCard
      icon={<ClipboardList size={24} className="text-yellow-600" />}
      label="Upcoming Assessments"
      value={stats.upcomingAssessments}
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

const RecentAttendanceTable = ({ records }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
    <TableHeader
      icon={<Users size={20} className="text-blue-600" />}
      title="Recent Attendance"
    />

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableColumn>Class</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Present</TableColumn>
            <TableColumn>Absent</TableColumn>
            <TableColumn>Attendance Rate</TableColumn>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map(record => (
            <tr key={record.id}>
              <TableCell className="font-medium">{record.class}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.present}</TableCell>
              <TableCell>{record.absent}</TableCell>
              <TableCell>
                {Math.round((record.present / record.total) * 100)}%
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const UpcomingAssessmentsTable = ({ assessments }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <TableHeader
      icon={<ClipboardList size={20} className="text-blue-600" />}
      title="Upcoming Assessments"
    />

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableColumn>Title</TableColumn>
            <TableColumn>Class</TableColumn>
            <TableColumn>Subject</TableColumn>
            <TableColumn>Date</TableColumn>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assessments.map(assessment => (
            <tr key={assessment.id}>
              <TableCell className="font-medium">{assessment.title}</TableCell>
              <TableCell>{assessment.class}</TableCell>
              <TableCell>{assessment.subject}</TableCell>
              <TableCell>{assessment.date}</TableCell>
            </tr>
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

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

export default TeacherDashboard