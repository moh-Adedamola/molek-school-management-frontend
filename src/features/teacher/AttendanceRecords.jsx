"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAttendance, updateAttendance } from "../../store/slices/attendanceSlice"
import { fetchClasses } from "../../store/slices/classSlice"

const AttendanceRecords = () => {
  const dispatch = useDispatch()
  const { attendance, loading, error } = useSelector((state) => state.attendance)
  const { classes } = useSelector((state) => state.classes)
  const { user } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({
    classId: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
  })

  useEffect(() => {
    dispatch(fetchClasses())
  }, [dispatch])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (filters.classId) {
      dispatch(fetchAttendance(filters))
    }
  }

  const handleStatusChange = (studentId, newStatus) => {
    const attendanceRecord = attendance.find((record) => record.studentId === studentId)
    if (attendanceRecord) {
      dispatch(
        updateAttendance({
          ...attendanceRecord,
          status: newStatus,
        }),
      )
    }
  }

  const handleNoteChange = (studentId, note) => {
    const attendanceRecord = attendance.find((record) => record.studentId === studentId)
    if (attendanceRecord) {
      dispatch(
        updateAttendance({
          ...attendanceRecord,
          note,
        }),
      )
    }
  }

  // Filter classes based on teacher assignments
  const teacherClasses = classes

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Attendance Records</h1>
      <p className="mt-1 text-sm text-gray-600">Record and manage daily attendance for your assigned classes</p>

      {/* Filters */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Select Class and Date</h3>
            <p className="mt-1 text-sm text-gray-500">Choose the class and date to view and record attendance.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
                    Class
                  </label>
                  <select
                    id="classId"
                    name="classId"
                    value={filters.classId}
                    onChange={handleFilterChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Class</option>
                    {teacherClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Attendance
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="mt-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : attendance.length > 0 ? (
        <div className="mt-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <select
                              value={record.status}
                              onChange={(e) => handleStatusChange(record.studentId, e.target.value)}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="late">Late</option>
                              <option value="excused">Excused</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={record.note || ""}
                            onChange={(e) => handleNoteChange(record.studentId, e.target.value)}
                            placeholder="Add a note (optional)"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <p className="text-gray-500">
            {filters.classId
              ? "No attendance records found for the selected class and date."
              : "Select a class and date to view attendance records."}
          </p>
        </div>
      )}
    </div>
  )
}

export default AttendanceRecords
