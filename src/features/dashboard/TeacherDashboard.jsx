"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, Calendar, ClipboardList, TrendingUp } from "lucide-react"

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
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-indigo-600 absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 font-medium text-sm sm:text-base text-center">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <DashboardHeader />
        
        <div className="space-y-6 sm:space-y-8">
          <AcademicPeriodInfo
            session={data.stats.currentSession}
            term={data.stats.currentTerm}
          />

          <StatsGrid stats={data.stats} />

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 sm:gap-8">
            <RecentAttendanceTable records={data.recentAttendance} />
            <UpcomingAssessmentsTable assessments={data.upcomingAssessments} />
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardHeader = () => (
  <div className="mb-6 sm:mb-8 lg:mb-10">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-2">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Welcome back, Teacher</h1>
        <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-1">Here's what's happening with your classes today</p>
      </div>
    </div>
  </div>
)

const AcademicPeriodInfo = ({ session, term }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/50 backdrop-blur-sm">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="space-y-2 sm:space-y-1 min-w-0 flex-1">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Current Academic Period</h2>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
            <span className="font-medium text-sm sm:text-base">Session: {session}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
            <span className="font-medium text-sm sm:text-base">Term: {term}</span>
          </div>
        </div>
      </div>
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
      </div>
    </div>
  </div>
)

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
    <StatCard
      icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
      label="Assigned Classes"
      value={stats.assignedClasses}
      gradient="from-blue-500 to-blue-600"
      bgGradient="from-blue-50 to-blue-100"
    />
    <StatCard
      icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
      label="Total Students"
      value={stats.totalStudents}
      gradient="from-emerald-500 to-emerald-600"
      bgGradient="from-emerald-50 to-emerald-100"
    />
    <StatCard
      icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
      label="Assigned Subjects"
      value={stats.assignedSubjects}
      gradient="from-purple-500 to-purple-600"
      bgGradient="from-purple-50 to-purple-100"
    />
    <StatCard
      icon={<ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />}
      label="Upcoming Assessments"
      value={stats.upcomingAssessments}
      gradient="from-orange-500 to-orange-600"
      bgGradient="from-orange-50 to-orange-100"
    />
  </div>
)

const StatCard = ({ icon, label, value, gradient, bgGradient }) => (
  <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${bgGradient} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
        <div className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
          {icon}
        </div>
      </div>
      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</h3>
      <p className="text-slate-600 font-medium text-sm sm:text-base">{label}</p>
    </div>
  </div>
)

const RecentAttendanceTable = ({ records }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
    <div className="p-4 sm:p-6 border-b border-slate-100">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Recent Attendance</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Latest attendance records</p>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-full">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Class</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Date</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Present</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Absent</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record, index) => {
            const rate = Math.round((record.present / record.total) * 100)
            return (
              <tr key={record.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">{record.class}</span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base whitespace-nowrap">{record.date}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {record.present}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {record.absent}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 sm:w-12 bg-slate-200 rounded-full h-1.5 sm:h-2 flex-shrink-0">
                      <div 
                        className={`h-1.5 sm:h-2 rounded-full ${rate >= 90 ? 'bg-emerald-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap">{rate}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </div>
)

const UpcomingAssessmentsTable = ({ assessments }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
    <div className="p-4 sm:p-6 border-b border-slate-100">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Upcoming Assessments</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Schedule and manage your tests</p>
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
      {assessments.map((assessment, index) => (
        <div key={assessment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-150 space-y-2 sm:space-y-0">
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex-shrink-0 mt-1 sm:mt-0"></div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{assessment.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                <span className="text-xs sm:text-sm text-slate-600">{assessment.class}</span>
                <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm text-slate-600">{assessment.subject}</span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0 ml-6 sm:ml-0">
            <div className="text-sm font-medium text-slate-900">{assessment.date}</div>
            <div className="text-xs text-slate-500 mt-1">Due Date</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default TeacherDashboard