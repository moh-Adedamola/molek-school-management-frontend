"use client"

import { useState, useEffect } from "react"
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Award, 
  Clock,
  TrendingUp,
  Star,
  Target,
  Heart,
  User,
  ChevronDown,
  Trophy,
  BarChart3,
  BookOpenCheck
} from "lucide-react"
import { toast } from "react-toastify"

// Mock API service
const ParentDashboardService = {
  fetchData: () => new Promise(resolve => {
    setTimeout(() => resolve({
      children: [
        {
          id: 1,
          name: "Tadese Maryam",
          class: "JSS 2A",
          age: 13,
          gender: "Female",
          admissionNumber: "STD2022001",
          profileImage: null,
        },
      ],
      stats: {
        currentTerm: "First Term",
        currentSession: "2023/2024",
        attendanceRate: 95,
        averageGrade: "B",
        subjects: 9,
        position: "5th",
        totalStudents: 42,
      },
      recentGrades: [
        { id: 1, subject: "Mathematics", test1: 12, test2: 14, exam: 60, total: 86, grade: "A", maxScore: 15 },
        { id: 2, subject: "English Language", test1: 13, test2: 12, exam: 58, total: 83, grade: "B", maxScore: 15 },
        { id: 3, subject: "Basic Science", test1: 10, test2: 13, exam: 55, total: 78, grade: "B", maxScore: 15 },
        { id: 4, subject: "Social Studies", test1: 11, test2: 12, exam: 52, total: 75, grade: "B", maxScore: 15 },
        { id: 5, subject: "French", test1: 14, test2: 13, exam: 61, total: 88, grade: "A", maxScore: 15 },
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Parent Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Monitor your child's academic journey and celebrate their achievements.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <Heart size={16} className="text-pink-500" />
              <span className="text-sm text-gray-600">Proud Parent Portal</span>
            </div>
          </div>
        </div>
      </div>

      {data.children.length > 1 && (
        <ChildSelector
          children={data.children}
          selectedChild={selectedChild}
          onChange={setSelectedChild}
        />
      )}

      <ChildProfileSection
        child={selectedChild}
        session={data.stats.currentSession}
        term={data.stats.currentTerm}
      />

      <StatsGrid stats={data.stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <AcademicPerformanceSection grades={data.recentGrades} />
        </div>
        <div className="space-y-6">
          <ProgressInsights stats={data.stats} />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  )
}

// Sub-components
const ChildSelector = ({ children, selectedChild, onChange }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Child</label>
    <div className="relative">
      <select
        value={selectedChild?.id}
        onChange={(e) => {
          const child = children.find(c => c.id === Number(e.target.value))
          onChange(child)
        }}
        className="w-full p-4 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
      >
        {children.map(child => (
          <option key={child.id} value={child.id}>{child.name} - {child.class}</option>
        ))}
      </select>
      <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  </div>
)

const ChildProfileSection = ({ child, session, term }) => (
  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {child.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{child.name}</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Class: <span className="font-semibold text-gray-900">{child.class}</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span className="text-gray-600">ID: <span className="font-semibold text-gray-900">{child.admissionNumber}</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Age: <span className="font-semibold text-gray-900">{child.age} years</span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Calendar size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Academic Session</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{session}</p>
          <p className="text-sm text-gray-600">{term}</p>
        </div>
      </div>
    </div>
  </div>
)

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <StatCard
      icon={<Calendar size={24} />}
      label="Attendance Rate"
      value={`${stats.attendanceRate}%`}
      change="Great!"
      color="blue"
      description="Days present this term"
    />
    <StatCard
      icon={<Award size={24} />}
      label="Average Grade"
      value={stats.averageGrade}
      change="Improving"
      color="emerald"
      description="Overall performance"
    />
    <StatCard
      icon={<BookOpen size={24} />}
      label="Subjects"
      value={stats.subjects}
      change="All enrolled"
      color="purple"
      description="Active subjects"
    />
    <StatCard
      icon={<Trophy size={24} />}
      label="Class Position"
      value={stats.position}
      change={`of ${stats.totalStudents}`}
      color="amber"
      description="Current ranking"
    />
  </div>
)

const StatCard = ({ icon, label, value, change, color = "blue", description }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
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
          <Star size={12} className="text-yellow-500" />
          <span className="text-gray-600 font-medium">{change}</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}

const AcademicPerformanceSection = ({ grades }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart3 size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Academic Performance</h2>
            <p className="text-sm text-gray-600">Latest assessment results</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Average Score</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(grades.reduce((acc, grade) => acc + grade.total, 0) / grades.length)}%
          </p>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">CA 1 (15)</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">CA 2 (15)</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam (70)</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total (100)</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {grades.map((grade, index) => (
            <GradeRow key={grade.id} grade={grade} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const GradeRow = ({ grade, index }) => {
  const gradeColors = {
    A: "bg-green-100 text-green-800 border-green-200",
    B: "bg-blue-100 text-blue-800 border-blue-200",
    C: "bg-yellow-100 text-yellow-800 border-yellow-200",
    D: "bg-orange-100 text-orange-800 border-orange-200",
    F: "bg-red-100 text-red-800 border-red-200"
  }

  const percentage = (grade.total / 100) * 100

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
            <BookOpenCheck size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{grade.subject}</p>
            <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center font-medium text-gray-900">{grade.test1}</td>
      <td className="px-6 py-4 text-center font-medium text-gray-900">{grade.test2}</td>
      <td className="px-6 py-4 text-center font-medium text-gray-900">{grade.exam}</td>
      <td className="px-6 py-4 text-center">
        <span className="text-lg font-bold text-gray-900">{grade.total}</span>
        <span className="text-sm text-gray-500 ml-1">/{100}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${gradeColors[grade.grade]}`}>
          {grade.grade}
        </span>
      </td>
    </tr>
  )
}

const ProgressInsights = ({ stats }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
        <TrendingUp size={20} className="text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Progress Insights</h3>
    </div>
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-center space-x-2 mb-2">
          <Target size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-800">Attendance Goal</span>
        </div>
        <p className="text-xs text-green-700">Your child maintains excellent attendance at {stats.attendanceRate}%</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Award size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Academic Standing</span>
        </div>
        <p className="text-xs text-blue-700">Ranked {stats.position} out of {stats.totalStudents} students</p>
      </div>
    </div>
  </div>
)

const UpcomingEvents = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Calendar size={20} className="text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
      </div>
    </div>
    <div className="space-y-4">
      {[
        { event: "Mid-term Break", date: "Next Week", color: "blue" },
        { event: "Parent-Teacher Meeting", date: "Dec 15", color: "green" },
        { event: "End of Term Exam", date: "Dec 20-22", color: "orange" },
      ].map((item, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
          <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{item.event}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default ParentDashboard