"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Check, X } from "lucide-react"
import { toast } from "react-toastify"

// Mock API services
const AttendanceService = {
  fetchClasses: () => new Promise(resolve => {
    setTimeout(() => resolve({
      classes: [
        { id: 1, name: "JSS 1A" },
        { id: 2, name: "JSS 2B" },
        { id: 3, name: "JSS 3A" },
      ]
    }), 500)
  }),

  fetchStudents: (classId) => new Promise(resolve => {
    setTimeout(() => {
      resolve(Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        admissionNumber: `STD${classId}${i + 1}`,
        present: Math.random() > 0.2
      })))
    }, 500)
  }),

  saveAttendance: (data) => new Promise(resolve => {
    setTimeout(() => {
      console.log("Attendance saved:", data)
      resolve({ success: true })
    }, 1000)
  })
}

const AttendanceRecords = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await AttendanceService.fetchClasses()
        setClasses(data.classes)
      } catch (error) {
        console.error("Failed to load classes:", error)
        toast.error("Failed to load classes")
      }
    }
    loadClasses()
  }, [])

  // Handle class selection change
  const handleClassChange = useCallback(async (classId) => {
    setSelectedClass(classId)
    setStudents([])

    if (!classId) return

    setIsLoading(true)
    try {
      const studentsData = await AttendanceService.fetchStudents(classId)
      setStudents(studentsData)
    } catch (error) {
      console.error("Failed to load students:", error)
      toast.error("Failed to load students")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Toggle student attendance status
  const toggleAttendance = useCallback((studentId) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId ? { ...student, present: !student.present } : student
    ))
  }, [])

  // Mark all students as present
  const markAllPresent = useCallback(() => {
    setStudents(prev => prev.map(student => ({ ...student, present: true })))
  }, [])

  // Save attendance records
  const handleSaveAttendance = useCallback(async () => {
    if (!selectedClass || !selectedDate) {
      toast.error("Please select both class and date")
      return
    }

    setIsSaving(true)
    try {
      await AttendanceService.saveAttendance({
        classId: selectedClass,
        date: selectedDate,
        attendance: students.map(student => ({
          studentId: student.id,
          present: student.present
        }))
      })
      toast.success("Attendance saved successfully")
    } catch (error) {
      console.error("Failed to save attendance:", error)
      toast.error("Failed to save attendance")
    } finally {
      setIsSaving(false)
    }
  }, [selectedClass, selectedDate, students])

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track and manage student attendance
        </p>
      </header>

      <AttendanceFilters
        classes={classes}
        selectedClass={selectedClass}
        selectedDate={selectedDate}
        onClassChange={handleClassChange}
        onDateChange={setSelectedDate}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : selectedClass ? (
        students.length > 0 ? (
          <AttendanceTable
            students={students}
            date={selectedDate}
            onToggle={toggleAttendance}
            onMarkAllPresent={markAllPresent}
            onSave={handleSaveAttendance}
            isSaving={isSaving}
          />
        ) : (
          <EmptyState message="No students found for this class." />
        )
      ) : (
        <EmptyState message="Please select a class to view attendance." />
      )}
    </div>
  )
}

// Sub-components
const AttendanceFilters = ({ classes, selectedClass, selectedDate, onClassChange, onDateChange }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Class
        </label>
        <select
          id="class-select"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          aria-label="Select class"
        >
          <option value="">Select a class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          id="date-select"
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          aria-label="Select date"
        />
      </div>
    </div>
  </div>
)

const AttendanceTable = ({ students, date, onToggle, onMarkAllPresent, onSave, isSaving }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 bg-blue-50 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-lg font-semibold flex items-center">
        <Calendar size={20} className="mr-2 text-blue-600" />
        Attendance for {date}
      </h2>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={onMarkAllPresent}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
          aria-label="Mark all students present"
        >
          Mark All Present
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors"
          aria-label={isSaving ? "Saving attendance" : "Save attendance"}
        >
          {isSaving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader>Student Name</TableHeader>
            <TableHeader>Admission Number</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader align="right">Action</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map(student => (
            <StudentRow
              key={student.id}
              student={student}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const StudentRow = ({ student, onToggle }) => (
  <tr>
    <TableCell className="font-medium">{student.name}</TableCell>
    <TableCell>{student.admissionNumber}</TableCell>
    <TableCell>
      <StatusBadge present={student.present} />
    </TableCell>
    <TableCell align="right">
      <button
        onClick={() => onToggle(student.id)}
        className={`p-1.5 rounded-full transition-colors ${student.present
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        aria-label={student.present ? "Mark student absent" : "Mark student present"}
      >
        {student.present ? <X size={16} /> : <Check size={16} />}
      </button>
    </TableCell>
  </tr>
)

const StatusBadge = ({ present }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
  >
    {present ? "Present" : "Absent"}
  </span>
)

const TableHeader = ({ children, align = "left" }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${align === "right" ? "text-right" : ""
      }`}
  >
    {children}
  </th>
)

const TableCell = ({ children, align = "left", className = "" }) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm ${align === "right" ? "text-right" : ""
      } ${className}`}
  >
    {children}
  </td>
)

const EmptyState = ({ message }) => (
  <div className="bg-white p-8 rounded-lg shadow text-center">
    <p className="text-gray-500">{message}</p>
  </div>
)

export default AttendanceRecords