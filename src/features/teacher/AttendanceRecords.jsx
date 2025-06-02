"use client"

import { useState, useEffect } from "react"
import { Calendar, Check, X } from "lucide-react"
import { toast } from "react-toastify"

// Mock API call - replace with actual API call in production
const fetchClassesAndStudents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        classes: [
          { id: 1, name: "JSS 1A" },
          { id: 2, name: "JSS 2B" },
          { id: 3, name: "JSS 3A" },
        ],
      })
    }, 500)
  })
}

const fetchStudents = (classId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock students based on class ID
      const students = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        admissionNumber: `STD${classId}${i + 1}`,
        present: Math.random() > 0.2, // 80% chance of being present
      }))

      resolve(students)
    }, 500)
  })
}

const saveAttendance = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving attendance:", data)
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

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchClassesAndStudents()
        setClasses(data.classes)
      } catch (error) {
        console.error("Error loading classes:", error)
        toast.error("Failed to load classes")
      }
    }

    loadClasses()
  }, [])

  const handleClassChange = async (e) => {
    const classId = e.target.value
    setSelectedClass(classId)

    if (classId) {
      setIsLoading(true)
      try {
        const studentsData = await fetchStudents(classId)
        setStudents(studentsData)
      } catch (error) {
        console.error("Error loading students:", error)
        toast.error("Failed to load students")
      } finally {
        setIsLoading(false)
      }
    } else {
      setStudents([])
    }
  }

  const toggleAttendance = (studentId) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            present: !student.present,
          }
        }
        return student
      }),
    )
  }

  const markAllPresent = () => {
    setStudents(
      students.map((student) => ({
        ...student,
        present: true,
      })),
    )
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error("Please select both class and date")
      return
    }

    setIsSaving(true)
    try {
      const attendanceData = {
        classId: selectedClass,
        date: selectedDate,
        attendance: students.map((student) => ({
          studentId: student.id,
          present: student.present,
        })),
      }

      await saveAttendance(attendanceData)
      toast.success("Attendance saved successfully")
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast.error("Failed to save attendance")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : selectedClass && students.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar size={20} className="mr-2 text-blue-600" />
              Attendance for {selectedDate}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={markAllPresent}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSaveAttendance}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.present ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                          student.present ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {student.present ? <X size={16} /> : <Check size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedClass && students.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No students found for this class.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Please select a class to view and record attendance.</p>
        </div>
      )}
    </div>
  )
}

export default AttendanceRecords
