"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { Calendar, Download, Printer, BarChart2 } from "lucide-react"

// Mock API service
const AttendanceService = {
  fetchStudentData: () => new Promise(resolve => {
    setTimeout(() => resolve({
      student: {
        id: 1,
        name: "Tadese Maryam.",
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

      // Generate school days (Mon-Fri)
      while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          schoolDays.push(new Date(currentDate))
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Generate attendance records (90% present)
      const attendanceRecords = schoolDays.map(date => ({
        date: date.toISOString().split("T")[0],
        status: Math.random() < 0.9 ? "present" : "absent",
        reason: Math.random() < 0.9 ? "" : ["Sick", "Family emergency", "Other"][Math.floor(Math.random() * 3)],
      }))

      // Calculate summary stats
      const totalDays = attendanceRecords.length
      const presentDays = attendanceRecords.filter(r => r.status === "present").length
      const absentDays = totalDays - presentDays
      const attendanceRate = Math.round((presentDays / totalDays) * 100)

      // Group by month for chart
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

  // Load initial student data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AttendanceService.fetchStudentData()
        setStudent(data.student)
        setTerms(data.terms)
        setSessions(data.sessions)
      } catch (error) {
        console.error("Failed to load student data:", error)
        toast.error("Failed to load student data")
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadData()
  }, [])

  // Fetch attendance data
  const handleViewAttendance = useCallback(async () => {
    if (!selectedTerm || !selectedSession) {
      toast.error("Please select both term and session")
      return
    }

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
      toast.error("Failed to fetch attendance data")
    } finally {
      setIsLoading(false)
    }
  }, [selectedTerm, selectedSession, student?.id])

  const handlePrintReport = useCallback(() => {
    window.print()
  }, [])

  const handleDownloadReport = useCallback(() => {
    toast.info("Export functionality would be implemented here")
  }, [])

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Attendance</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track and manage student attendance records
        </p>
      </header>

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
        <AttendanceReport
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
  )
}

// Sub-components
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
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{student?.name}</h2>
        <p className="text-sm text-gray-600">Class: {student?.class}</p>
        <p className="text-sm text-gray-600">Admission: {student?.admissionNumber}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Select Term"
          options={terms}
          value={selectedTerm}
          onChange={onTermChange}
        />
        <SelectInput
          label="Select Session"
          options={sessions}
          value={selectedSession}
          onChange={onSessionChange}
        />
      </div>
    </div>

    <div className="mt-6 flex justify-end">
      <button
        onClick={onViewAttendance}
        disabled={isLoading || !selectedTerm || !selectedSession}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors disabled:opacity-50"
        aria-label={isLoading ? "Loading attendance" : "View attendance"}
      >
        <Calendar size={18} className="mr-2" />
        {isLoading ? "Loading..." : "View Attendance"}
      </button>
    </div>
  </div>
)

const SelectInput = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
)

const AttendanceReport = ({
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
    <div className="bg-white rounded-lg shadow overflow-hidden" id="printable-attendance-report">
      <ReportHeader 
        termName={termName}
        sessionName={sessionName}
        onPrint={onPrint}
        onDownload={onDownload}
      />

      <AttendanceSummary summary={attendanceData.summary} />

      <MonthlyAttendanceChart monthlyAttendance={attendanceData.monthlyAttendance} />

      <AttendanceRecordsTable records={attendanceData.attendanceRecords} />

      <ReportFooter />
    </div>
  )
}

const ReportHeader = ({ termName, sessionName, onPrint, onDownload }) => (
  <div className="p-4 bg-blue-50 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:bg-white">
    <div>
      <h2 className="text-lg font-semibold">Attendance Report</h2>
      <p className="text-sm text-gray-600">
        {termName}, {sessionName} Academic Session
      </p>
    </div>
    <div className="flex gap-2 print:hidden">
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

const ActionButton = ({ icon, label, onClick, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    green: "bg-green-100 hover:bg-green-200 text-green-700",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-700"
  }

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} px-3 py-1 rounded-md flex items-center text-sm transition-colors`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </button>
  )
}

const AttendanceSummary = ({ summary }) => (
  <div className="p-4 border-b border-gray-200">
    <h3 className="text-md font-semibold mb-3">Attendance Summary</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total School Days" value={summary.totalDays} color="blue" />
      <StatCard label="Days Present" value={summary.presentDays} color="green" />
      <StatCard label="Days Absent" value={summary.absentDays} color="red" />
      <StatCard label="Attendance Rate" value={`${summary.attendanceRate}%`} color="purple" />
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
    <div className={`${colorClasses[color]} p-3 rounded-lg`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

const MonthlyAttendanceChart = ({ monthlyAttendance }) => (
  <div className="p-4 border-b border-gray-200 print:hidden">
    <div className="flex items-center mb-3">
      <BarChart2 size={18} className="mr-2 text-blue-600" />
      <h3 className="text-md font-semibold">Monthly Attendance</h3>
    </div>
    <div className="grid grid-cols-4 gap-2 mb-2">
      {monthlyAttendance.map(({ month, rate }) => (
        <div key={month} className="text-center">
          <div className="text-sm font-medium">{month}</div>
          <div className="text-xs text-gray-500">{rate}% attendance</div>
        </div>
      ))}
    </div>
    <div className="h-24 flex items-end space-x-2">
      {monthlyAttendance.map(({ month, rate, presentDays, totalDays }) => (
        <div key={month} className="flex flex-col items-center flex-1">
          <div
            className={`w-full rounded-t-sm ${
              rate >= 90 ? "bg-green-500" :
              rate >= 80 ? "bg-blue-500" :
              rate >= 70 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ height: `${rate}%` }}
          />
          <div className="text-xs mt-2">
            {presentDays}/{totalDays}
          </div>
        </div>
      ))}
    </div>
  </div>
)

const AttendanceRecordsTable = ({ records }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>Date</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Reason (if absent)</TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {records.map((record, index) => (
          <AttendanceRecordRow key={index} record={record} />
        ))}
      </tbody>
    </table>
  </div>
)

const TableHeader = ({ children }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
)

const AttendanceRecordRow = ({ record }) => (
  <tr>
    <TableCell>
      {new Date(record.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </TableCell>
    <TableCell>
      <StatusBadge status={record.status} />
    </TableCell>
    <TableCell>{record.reason || "-"}</TableCell>
  </tr>
)

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {status === "present" ? "Present" : "Absent"}
  </span>
)

const ReportFooter = () => (
  <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
    <p>Report generated on {new Date().toLocaleDateString()}</p>
  </div>
)

export default StudentAttendance