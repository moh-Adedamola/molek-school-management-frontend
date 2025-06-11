"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Download, Printer, BarChart2, User, GraduationCap, Hash, TrendingUp, Clock, CheckCircle2, XCircle, Eye } from "lucide-react"

// Mock API service
const AttendanceService = {
  fetchStudentData: () => new Promise(resolve => {
    setTimeout(() => resolve({
      student: {
        id: 1,
        name: "Tadese Maryam",
        class: "JSS 2A",
        admissionNumber: "STD2022001",
      },
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
    }), 500)
  }),

  fetchAttendanceData: (studentId, termId, sessionId) => new Promise(resolve => {
    setTimeout(() => {
      const startDate = new Date("2023-09-01")
      const endDate = new Date("2023-12-15")
      const schoolDays = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          schoolDays.push(new Date(currentDate))
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const attendanceRecords = schoolDays.map(date => ({
        date: date.toISOString().split("T")[0],
        status: Math.random() < 0.9 ? "present" : "absent",
        reason: Math.random() < 0.9 ? "" : ["Sick", "Family emergency", "Other"][Math.floor(Math.random() * 3)],
      }))

      const totalDays = attendanceRecords.length
      const presentDays = attendanceRecords.filter(r => r.status === "present").length
      const absentDays = totalDays - presentDays
      const attendanceRate = Math.round((presentDays / totalDays) * 100)

      const months = ["September", "October", "November", "December"]
      const monthlyAttendance = months.map(month => {
        const monthRecords = attendanceRecords.filter(record => {
          const recordMonth = new Date(record.date).toLocaleString("default", { month: "long" })
          return recordMonth === month
        })
        const monthTotalDays = monthRecords.length
        const monthPresentDays = monthRecords.filter(r => r.status === "present").length
        const monthRate = monthTotalDays > 0 ? Math.round((monthPresentDays / monthTotalDays) * 100) : 0

        return {
          month,
          totalDays: monthTotalDays,
          presentDays: monthPresentDays,
          rate: monthRate,
        }
      })

      resolve({
        attendanceRecords,
        summary: { totalDays, presentDays, absentDays, attendanceRate },
        monthlyAttendance,
      })
    }, 1000)
  })
}

const StudentAttendance = () => {
  const [student, setStudent] = useState(null)
  const [terms, setTerms] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedSession, setSelectedSession] = useState("")
  const [attendanceData, setAttendanceData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AttendanceService.fetchStudentData()
        setStudent(data.student)
        setTerms(data.terms)
        setSessions(data.sessions)
      } catch (error) {
        console.error("Failed to load student data:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadData()
  }, [])

  const handleViewAttendance = useCallback(async () => {
    if (!selectedTerm || !selectedSession) return

    setIsLoading(true)
    try {
      const data = await AttendanceService.fetchAttendanceData(
        student.id,
        selectedTerm,
        selectedSession
      )
      setAttendanceData(data)
    } catch (error) {
      console.error("Failed to fetch attendance:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedTerm, selectedSession, student?.id])

  const handlePrintReport = useCallback(() => {
    window.print()
  }, [])

  const handleDownloadReport = useCallback(() => {
    console.log("Export functionality")
  }, [])

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading student data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Student Attendance
              </h1>
              <p className="text-slate-500 font-medium">Track and analyze attendance patterns</p>
            </div>
          </div>
        </div>

        <AttendanceFilters
          student={student}
          terms={terms}
          sessions={sessions}
          selectedTerm={selectedTerm}
          selectedSession={selectedSession}
          onTermChange={setSelectedTerm}
          onSessionChange={setSelectedSession}
          onViewAttendance={handleViewAttendance}
          isLoading={isLoading}
        />

        {attendanceData && (
          <AttendanceReportModern
            attendanceData={attendanceData}
            selectedTerm={selectedTerm}
            selectedSession={selectedSession}
            terms={terms}
            sessions={sessions}
            onPrint={handlePrintReport}
            onDownload={handleDownloadReport}
          />
        )}
      </div>
    </div>
  )
}

const AttendanceFilters = ({
  student,
  terms,
  sessions,
  selectedTerm,
  selectedSession,
  onTermChange,
  onSessionChange,
  onViewAttendance,
  isLoading
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      {/* Student Info */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{student?.name}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2 text-slate-600">
                <GraduationCap className="w-4 h-4" />
                <span className="font-medium">{student?.class}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Hash className="w-4 h-4" />
                <span className="font-medium">{student?.admissionNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:min-w-96">
        <SelectInputModern
          label="Academic Term"
          options={terms}
          value={selectedTerm}
          onChange={onTermChange}
          icon={<Clock className="w-4 h-4" />}
        />
        <SelectInputModern
          label="Academic Session"
          options={sessions}
          value={selectedSession}
          onChange={onSessionChange}
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>
    </div>

    <div className="mt-8 flex justify-end">
      <button
        onClick={onViewAttendance}
        disabled={isLoading || !selectedTerm || !selectedSession}
        className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center space-x-3"
      >
        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>{isLoading ? "Analyzing..." : "View Attendance"}</span>
      </button>
    </div>
  </div>
)

const SelectInputModern = ({ label, options, value, onChange, icon }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
      {icon}
      <span>{label}</span>
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-slate-700 hover:bg-slate-100"
    >
      <option value="">Choose {label.toLowerCase()}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
)

const AttendanceReportModern = ({
  attendanceData,
  selectedTerm,
  selectedSession,
  terms,
  sessions,
  onPrint,
  onDownload
}) => {
  const termName = terms.find(t => t.id.toString() === selectedTerm)?.name
  const sessionName = sessions.find(s => s.id.toString() === selectedSession)?.name

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Report Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Attendance Analysis</h2>
              <p className="text-blue-100 font-medium">{termName} • {sessionName} Academic Session</p>
            </div>
            <div className="flex gap-3">
              <ActionButtonModern 
                icon={<Printer className="w-4 h-4" />}
                label="Print Report"
                onClick={onPrint}
                variant="secondary"
              />
              <ActionButtonModern 
                icon={<Download className="w-4 h-4" />}
                label="Export Data"
                onClick={onDownload}
                variant="primary"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCardModern 
              icon={<Calendar className="w-6 h-6" />}
              label="Total School Days" 
              value={attendanceData.summary.totalDays} 
              color="blue" 
            />
            <SummaryCardModern 
              icon={<CheckCircle2 className="w-6 h-6" />}
              label="Days Present" 
              value={attendanceData.summary.presentDays} 
              color="emerald" 
            />
            <SummaryCardModern 
              icon={<XCircle className="w-6 h-6" />}
              label="Days Absent" 
              value={attendanceData.summary.absentDays} 
              color="red" 
            />
            <SummaryCardModern 
              icon={<TrendingUp className="w-6 h-6" />}
              label="Attendance Rate" 
              value={`${attendanceData.summary.attendanceRate}%`} 
              color="purple"
              highlight={true}
            />
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <MonthlyAttendanceChartModern monthlyAttendance={attendanceData.monthlyAttendance} />

      {/* Records Table */}
      <AttendanceRecordsTableModern records={attendanceData.attendanceRecords} />
    </div>
  )
}

const ActionButtonModern = ({ icon, label, onClick, variant = "primary" }) => {
  const variants = {
    primary: "bg-white/20 hover:bg-white/30 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white"
  }

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

const SummaryCardModern = ({ icon, label, value, color, highlight = false }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600", 
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600"
  }

  return (
    <div className={`relative p-6 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${highlight ? 'ring-2 ring-white/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      {highlight && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-yellow-800" />
        </div>
      )}
    </div>
  )
}

const MonthlyAttendanceChartModern = ({ monthlyAttendance }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <div className="flex items-center space-x-3 mb-8">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
        <BarChart2 className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Monthly Performance</h3>
    </div>
    
    <div className="grid grid-cols-4 gap-6 mb-6">
      {monthlyAttendance.map(({ month, rate, presentDays, totalDays }) => (
        <div key={month} className="text-center">
          <div className="text-lg font-bold text-slate-800">{month.slice(0, 3)}</div>
          <div className="text-sm text-slate-500 mb-2">{presentDays}/{totalDays} days</div>
          <div className={`text-sm font-semibold ${
            rate >= 90 ? "text-emerald-600" :
            rate >= 80 ? "text-blue-600" :
            rate >= 70 ? "text-yellow-600" : "text-red-600"
          }`}>
            {rate}%
          </div>
        </div>
      ))}
    </div>
    
    <div className="h-32 flex items-end space-x-4">
      {monthlyAttendance.map(({ month, rate }) => (
        <div key={month} className="flex flex-col items-center flex-1">
          <div
            className={`w-full rounded-t-lg transition-all duration-1000 hover:scale-105 ${
              rate >= 90 ? "bg-gradient-to-t from-emerald-400 to-emerald-500" :
              rate >= 80 ? "bg-gradient-to-t from-blue-400 to-blue-500" :
              rate >= 70 ? "bg-gradient-to-t from-yellow-400 to-yellow-500" : 
              "bg-gradient-to-t from-red-400 to-red-500"
            } shadow-lg`}
            style={{ height: `${Math.max(rate, 5)}%` }}
          />
        </div>
      ))}
    </div>
  </div>
)

const AttendanceRecordsTableModern = ({ records }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
    <div className="p-6 border-b border-slate-200">
      <h3 className="text-xl font-bold text-slate-800">Attendance Records</h3>
      <p className="text-slate-500">Complete daily attendance history</p>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record, index) => (
            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-800">
                {new Date(record.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short", 
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <StatusBadgeModern status={record.status} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {record.reason || "No additional notes"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const StatusBadgeModern = ({ status }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
    status === "present" 
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
      : "bg-red-100 text-red-700 border border-red-200"
  }`}>
    {status === "present" ? (
      <>
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Present
      </>
    ) : (
      <>
        <XCircle className="w-3 h-3 mr-1" />
        Absent
      </>
    )}
  </span>
)

export default StudentAttendance