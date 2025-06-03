"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPendingTeachers, approveTeacher } from "../../store/slices/authSlice"
import { Users, UserCheck, BookOpen, GraduationCap, Calendar } from "lucide-react"
import { toast } from "react-toastify"

// Mock API service
const AdminDashboardService = {
  fetchData: () => new Promise(resolve => {
    setTimeout(() => resolve({
      stats: {
        totalStudents: 450,
        totalTeachers: 32,
        totalClasses: 18,
        totalSubjects: 12,
        currentTerm: "First Term",
        currentSession: "2024/2025",
      },
      pendingTeachers: [
        { id: 1, name: "John Doe", email: "john.doe@school.com", appliedDate: "2023-05-15" },
        { id: 2, name: "Jane Smith", email: "jane.smith@school.com", appliedDate: "2023-05-16" },
      ],
    }), 1000)
  }),

  approveTeacher: (teacherId) => new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 500)
  })
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const { pendingTeachers } = useSelector((state) => state.auth)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AdminDashboardService.fetchData()
        setStats(data.stats)
        dispatch(setPendingTeachers(data.pendingTeachers))
      } catch (error) {
        console.error("Error loading dashboard:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dispatch])

  const handleApproveTeacher = async (teacherId) => {
    try {
      await AdminDashboardService.approveTeacher(teacherId)
      dispatch(approveTeacher(teacherId))
      toast.success("Teacher approved successfully")
    } catch (error) {
      console.error("Error approving teacher:", error)
      toast.error("Failed to approve teacher")
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">School management overview</p>
      </header>

      <AcademicPeriodInfo
        session={stats.currentSession}
        term={stats.currentTerm}
      />

      <StatsGrid stats={stats} />

      <PendingTeacherApprovals
        teachers={pendingTeachers}
        onApprove={handleApproveTeacher}
      />
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
      icon={<GraduationCap size={24} className="text-blue-600" />}
      label="Total Students"
      value={stats.totalStudents}
      color="blue"
    />
    <StatCard
      icon={<Users size={24} className="text-green-600" />}
      label="Total Teachers"
      value={stats.totalTeachers}
      color="green"
    />
    <StatCard
      icon={<BookOpen size={24} className="text-purple-600" />}
      label="Total Classes"
      value={stats.totalClasses}
      color="purple"
    />
    <StatCard
      icon={<BookOpen size={24} className="text-yellow-600" />}
      label="Total Subjects"
      value={stats.totalSubjects}
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

const PendingTeacherApprovals = ({ teachers, onApprove }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <TableHeader
      icon={<UserCheck size={20} className="text-blue-600" />}
      title="Pending Teacher Approvals"
    />

    {teachers.length === 0 ? (
      <EmptyState message="No pending teacher approvals" />
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Applied Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map(teacher => (
              <TeacherRow
                key={teacher.id}
                teacher={teacher}
                onApprove={onApprove}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
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

const TeacherRow = ({ teacher, onApprove }) => (
  <tr>
    <TableCell className="font-medium">{teacher.name}</TableCell>
    <TableCell>{teacher.email}</TableCell>
    <TableCell>{teacher.appliedDate}</TableCell>
    <TableCell>
      <div className="flex space-x-2">
        <button
          onClick={() => onApprove(teacher.id)}
          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm transition-colors"
        >
          Approve
        </button>
        <button className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm transition-colors">
          Reject
        </button>
      </div>
    </TableCell>
  </tr>
)

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

const EmptyState = ({ message }) => (
  <div className="p-4 text-center text-gray-500">
    {message}
  </div>
)

export default AdminDashboard