"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Menu
} from "lucide-react"

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
  const [pendingTeachers, setPendingTeachers] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AdminDashboardService.fetchData()
        setStats(data.stats)
        setPendingTeachers(data.pendingTeachers)
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleApproveTeacher = async (teacherId) => {
    try {
      await AdminDashboardService.approveTeacher(teacherId)
      setPendingTeachers(prev => prev.filter(t => t.id !== teacherId))
      // toast.success("Teacher approved successfully")
    } catch (error) {
      console.error("Error approving teacher:", error)
      // toast.error("Failed to approve teacher")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Welcome back! Here's what's happening at your school today.
            </p>
          </div>
          <div className="flex items-center">
            <div className="bg-white rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm text-gray-600">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <AcademicPeriodInfo
          session={stats.currentSession}
          term={stats.currentTerm}
        />

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <PendingTeacherApprovals
              teachers={pendingTeachers}
              onApprove={handleApproveTeacher}
            />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-components
const AcademicPeriodInfo = ({ session, term }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-indigo-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2 sm:space-y-1 flex-1">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Current Academic Period</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">
              Session: <span className="font-medium text-gray-900">{session}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">
              Term: <span className="font-medium text-gray-900">{term}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm self-start sm:self-auto">
        <Calendar size={24} className="text-indigo-600 sm:w-8 sm:h-8" />
      </div>
    </div>
  </div>
)

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <StatCard
      icon={<GraduationCap size={20} className="sm:w-6 sm:h-6" />}
      label="Total Students"
      value={stats.totalStudents}
      change="+12%"
      color="indigo"
    />
    <StatCard
      icon={<Users size={20} className="sm:w-6 sm:h-6" />}
      label="Total Teachers"
      value={stats.totalTeachers}
      change="+3%"
      color="emerald"
    />
    <StatCard
      icon={<BookOpen size={20} className="sm:w-6 sm:h-6" />}
      label="Total Classes"
      value={stats.totalClasses}
      change="No change"
      color="purple"
    />
    <StatCard
      icon={<BookOpen size={20} className="sm:w-6 sm:h-6" />}
      label="Total Subjects"
      value={stats.totalSubjects}
      change="+1"
      color="amber"
    />
  </div>
)

const StatCard = ({ icon, label, value, change, color = "indigo" }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/25",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/25",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/25",
    amber: "from-amber-500 to-amber-600 shadow-amber-500/25"
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <TrendingUp size={10} className="text-green-500 sm:w-3 sm:h-3" />
          <span className="text-green-600 font-medium text-xs sm:text-sm">{change}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-gray-600">{label}</p>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
      </div>
    </div>
  )
}

const PendingTeacherApprovals = ({ teachers, onApprove }) => (
  <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <UserCheck size={16} className="text-indigo-600 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pending Approvals</h2>
            <p className="text-xs sm:text-sm text-gray-600">{teachers.length} teachers awaiting approval</p>
          </div>
        </div>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium self-start sm:self-auto">
          View All
        </button>
      </div>
    </div>

    {teachers.length === 0 ? (
      <div className="p-8 sm:p-12 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserCheck size={20} className="text-gray-400 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
        <p className="text-sm sm:text-base text-gray-600">No pending teacher approvals at the moment.</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-200">
        {teachers.map(teacher => (
          <TeacherRow
            key={teacher.id}
            teacher={teacher}
            onApprove={onApprove}
          />
        ))}
      </div>
    )}
  </div>
)

const TeacherRow = ({ teacher, onApprove }) => (
  <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0">
          {teacher.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{teacher.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{teacher.email}</p>
          <p className="text-xs text-gray-500 mt-1">Applied: {new Date(teacher.appliedDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 justify-end sm:justify-start">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Eye size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onApprove(teacher.id)}
          className="flex items-center space-x-1 sm:space-x-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors"
        >
          <CheckCircle size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Approve</span>
        </button>
        <button className="flex items-center space-x-1 sm:space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors">
          <XCircle size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Reject</span>
        </button>
      </div>
    </div>
  </div>
)

const QuickActions = () => (
  <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="space-y-2 sm:space-y-3">
      {[
        { label: "Add New Student", icon: <GraduationCap size={14} className="sm:w-4 sm:h-4" />, color: "indigo" },
        { label: "Create Class", icon: <BookOpen size={14} className="sm:w-4 sm:h-4" />, color: "purple" },
        { label: "Generate Report", icon: <TrendingUp size={14} className="sm:w-4 sm:h-4" />, color: "emerald" },
      ].map((action, index) => (
        <button
          key={index}
          className="w-full flex items-center space-x-3 p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center bg-${action.color}-100 text-${action.color}-600 flex-shrink-0`}>
            {action.icon}
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
)

const RecentActivity = () => (
  <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
      <button className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm font-medium">
        View All
      </button>
    </div>
    <div className="space-y-3 sm:space-y-4">
      {[
        { action: "New student enrolled", time: "2 hours ago", color: "green" },
        { action: "Class schedule updated", time: "4 hours ago", color: "blue" },
        { action: "Report generated", time: "Yesterday", color: "purple" },
      ].map((item, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className={`w-2 h-2 rounded-full bg-${item.color}-500 mt-2 flex-shrink-0`}></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900">{item.action}</p>
            <p className="text-xs text-gray-500">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default AdminDashboard