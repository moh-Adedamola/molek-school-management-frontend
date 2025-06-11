"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setPendingTeachers, approveTeacher } from "../../store/slices/authSlice"
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
  MoreHorizontal
} from "lucide-react"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your school today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <AcademicPeriodInfo
        session={stats.currentSession}
        term={stats.currentTerm}
      />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
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
  )
}

// Sub-components
const AcademicPeriodInfo = ({ session, term }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Current Academic Period</h2>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="text-gray-600">Session: <span className="font-medium text-gray-900">{session}</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Term: <span className="font-medium text-gray-900">{term}</span></span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Calendar size={32} className="text-indigo-600" />
      </div>
    </div>
  </div>
)

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <StatCard
      icon={<GraduationCap size={24} />}
      label="Total Students"
      value={stats.totalStudents}
      change="+12%"
      color="indigo"
    />
    <StatCard
      icon={<Users size={24} />}
      label="Total Teachers"
      value={stats.totalTeachers}
      change="+3%"
      color="emerald"
    />
    <StatCard
      icon={<BookOpen size={24} />}
      label="Total Classes"
      value={stats.totalClasses}
      change="No change"
      color="purple"
    />
    <StatCard
      icon={<BookOpen size={24} />}
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <TrendingUp size={12} className="text-green-500" />
          <span className="text-green-600 font-medium">{change}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
      </div>
    </div>
  )
}

const PendingTeacherApprovals = ({ teachers, onApprove }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <UserCheck size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
            <p className="text-sm text-gray-600">{teachers.length} teachers awaiting approval</p>
          </div>
        </div>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          View All
        </button>
      </div>
    </div>

    {teachers.length === 0 ? (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserCheck size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
        <p className="text-gray-600">No pending teacher approvals at the moment.</p>
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
  <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
          {teacher.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
          <p className="text-sm text-gray-600">{teacher.email}</p>
          <p className="text-xs text-gray-500 mt-1">Applied: {new Date(teacher.appliedDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Eye size={16} />
        </button>
        <button
          onClick={() => onApprove(teacher.id)}
          className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <CheckCircle size={16} />
          <span>Approve</span>
        </button>
        <button className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <XCircle size={16} />
          <span>Reject</span>
        </button>
      </div>
    </div>
  </div>
)

const QuickActions = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="space-y-3">
      {[
        { label: "Add New Student", icon: <GraduationCap size={16} />, color: "indigo" },
        { label: "Create Class", icon: <BookOpen size={16} />, color: "purple" },
        { label: "Generate Report", icon: <TrendingUp size={16} />, color: "emerald" },
      ].map((action, index) => (
        <button
          key={index}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${action.color}-100 text-${action.color}-600`}>
            {action.icon}
          </div>
          <span className="text-sm font-medium text-gray-700">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
)

const RecentActivity = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
        View All
      </button>
    </div>
    <div className="space-y-4">
      {[
        { action: "New student enrolled", time: "2 hours ago", color: "green" },
        { action: "Class schedule updated", time: "4 hours ago", color: "blue" },
        { action: "Report generated", time: "Yesterday", color: "purple" },
      ].map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{item.action}</p>
            <p className="text-xs text-gray-500">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default AdminDashboard