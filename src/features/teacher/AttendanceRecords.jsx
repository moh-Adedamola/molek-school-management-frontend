"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Check, X, Users, Clock, CheckCircle2, XCircle } from "lucide-react"

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
        admissionNumber: `STD${classId}${String(i + 1).padStart(3, '0')}`,
        present: Math.random() > 0.3
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
    if (!selectedClass || !selectedDate) return

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
    } catch (error) {
      console.error("Failed to save attendance:", error)
    } finally {
      setIsSaving(false)
    }
  }, [selectedClass, selectedDate, students])

  const presentCount = students.filter(s => s.present).length
  const absentCount = students.length - presentCount

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-light text-slate-900">Attendance</h1>
          </div>
          <p className="text-slate-600 ml-13">Track and manage student attendance with ease</p>
        </div>

        {/* Filters */}
        <AttendanceFilters
          classes={classes}
          selectedClass={selectedClass}
          selectedDate={selectedDate}
          onClassChange={handleClassChange}
          onDateChange={setSelectedDate}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-sm">Loading students...</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && selectedClass && students.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Students"
                value={students.length}
                color="slate"
              />
              <StatCard
                icon={CheckCircle2}
                label="Present"
                value={presentCount}
                color="emerald"
              />
              <StatCard
                icon={XCircle}
                label="Absent"
                value={absentCount}
                color="rose"
              />
            </div>

            {/* Attendance Table */}
            <AttendanceTable
              students={students}
              date={selectedDate}
              onToggle={toggleAttendance}
              onMarkAllPresent={markAllPresent}
              onSave={handleSaveAttendance}
              isSaving={isSaving}
            />
          </>
        )}

        {/* Empty States */}
        {!isLoading && !selectedClass && (
          <EmptyState 
            icon={Calendar}
            title="Select a Class"
            message="Choose a class from the dropdown above to view attendance records"
          />
        )}

        {!isLoading && selectedClass && students.length === 0 && (
          <EmptyState 
            icon={Users}
            title="No Students Found"
            message="This class doesn't have any students enrolled"
          />
        )}
      </div>
    </div>
  )
}

// Components
const AttendanceFilters = ({ classes, selectedClass, selectedDate, onClassChange, onDateChange }) => (
  <div className="bg-white rounded-2xl border border-slate-200/60 p-8 mb-8 shadow-sm">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Class</label>
        <select
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 appearance-none cursor-pointer"
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
        >
          <option value="">Select a class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Date</label>
        <input
          type="date"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
  </div>
)

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200"
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-light text-slate-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

const AttendanceTable = ({ students, date, onToggle, onMarkAllPresent, onSave, isSaving }) => (
  <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
    {/* Header */}
    <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-200/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-medium text-slate-900">
            {new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onMarkAllPresent}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200"
          >
            Mark All Present
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Attendance"
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50/30">
          <tr>
            <th className="px-8 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              ID Number
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-8 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student, index) => (
            <StudentRow
              key={student.id}
              student={student}
              onToggle={onToggle}
              isLast={index === students.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const StudentRow = ({ student, onToggle, isLast }) => (
  <tr className="hover:bg-slate-50/50 transition-colors duration-150">
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-slate-600">
            {student.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <span className="text-sm font-medium text-slate-900">{student.name}</span>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className="text-sm text-slate-600 font-mono">{student.admissionNumber}</span>
    </td>
    <td className="px-6 py-5 text-center">
      <StatusBadge present={student.present} />
    </td>
    <td className="px-8 py-5 text-right">
      <button
        onClick={() => onToggle(student.id)}
        className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105 ${
          student.present
            ? "bg-rose-100 hover:bg-rose-200 text-rose-600"
            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-600"
        }`}
        title={student.present ? "Mark absent" : "Mark present"}
      >
        {student.present ? <X className="w-4 h-4 mx-auto" /> : <Check className="w-4 h-4 mx-auto" />}
      </button>
    </td>
  </tr>
)

const StatusBadge = ({ present }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
    present 
      ? "bg-emerald-100 text-emerald-700" 
      : "bg-rose-100 text-rose-700"
  }`}>
    <div className={`w-1.5 h-1.5 rounded-full ${
      present ? "bg-emerald-500" : "bg-rose-500"
    }`} />
    {present ? "Present" : "Absent"}
  </div>
)

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="bg-white rounded-2xl border border-slate-200/60 p-16 text-center shadow-sm">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 max-w-md mx-auto">{message}</p>
  </div>
)

export default AttendanceRecords