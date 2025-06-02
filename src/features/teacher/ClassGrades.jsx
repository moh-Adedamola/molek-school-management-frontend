"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGrades, updateGrade } from "../../store/slices/gradeSlice"
import { fetchClasses } from "../../store/slices/classSlice"
import { fetchSubjects } from "../../store/slices/subjectSlice"

const ClassGrades = () => {
  const dispatch = useDispatch()
  const { grades, loading, error } = useSelector((state) => state.grades)
  const { classes } = useSelector((state) => state.classes)
  const { subjects } = useSelector((state) => state.subjects)
  const { user } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({
    classId: "",
    subjectId: "",
    term: 1,
  })

  const [editingGrade, setEditingGrade] = useState(null)
  const [editForm, setEditForm] = useState({
    ca: 0,
    exam: 0,
  })

  useEffect(() => {
    dispatch(fetchClasses())
    dispatch(fetchSubjects())
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
    if (filters.classId && filters.subjectId) {
      dispatch(fetchGrades(filters))
    }
  }

  const handleEditClick = (grade) => {
    setEditingGrade(grade.id)
    setEditForm({
      ca: grade.ca,
      exam: grade.exam,
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    // Ensure values are within valid ranges
    let numValue = Number.parseInt(value, 10)

    if (name === "ca" && numValue > 30) numValue = 30
    if (name === "exam" && numValue > 70) numValue = 70
    if (numValue < 0) numValue = 0

    setEditForm({
      ...editForm,
      [name]: numValue,
    })
  }

  const handleSaveGrade = (gradeId) => {
    const gradeToUpdate = {
      id: gradeId,
      ca: editForm.ca,
      exam: editForm.exam,
    }

    dispatch(updateGrade(gradeToUpdate)).then(() => {
      setEditingGrade(null)
    })
  }

  const handleCancelEdit = () => {
    setEditingGrade(null)
  }

  // Helper function to safely calculate previous terms average
  const calculatePreviousTermsAverage = (previousTerms) => {
    if (!previousTerms || !Array.isArray(previousTerms) || previousTerms.length === 0) {
      return 0
    }
    const total = previousTerms.reduce((sum, term) => sum + (term?.total || 0), 0)
    return Math.round(total / previousTerms.length)
  }

  // Helper function to safely get previous term total
  const getPreviousTermTotal = (previousTerms, index = 0) => {
    if (!previousTerms || !Array.isArray(previousTerms) || !previousTerms[index]) {
      return 0
    }
    return previousTerms[index].total || 0
  }

  // Helper function to calculate cumulative average
  const calculateCumulativeAverage = (currentTotal, previousTerms) => {
    if (!previousTerms || !Array.isArray(previousTerms) || previousTerms.length === 0) {
      return currentTotal
    }
    const previousTotal = previousTerms.reduce((sum, term) => sum + (term?.total || 0), 0)
    return Math.round((currentTotal + previousTotal) / (previousTerms.length + 1))
  }

  // Filter classes and subjects based on teacher assignments
  const teacherClasses = classes || []
  const teacherSubjects = subjects || []

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Manage Class Grades</h1>
      <p className="mt-1 text-sm text-gray-600">
        View and update student grades for your assigned classes and subjects
      </p>

      {/* Filters */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Select Class and Subject</h3>
            <p className="mt-1 text-sm text-gray-500">Choose the class, subject, and term to view and manage grades.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-2">
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

                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select
                    id="subjectId"
                    name="subjectId"
                    value={filters.subjectId}
                    onChange={handleFilterChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Subject</option>
                    {teacherSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                    Term
                  </label>
                  <select
                    id="term"
                    name="term"
                    value={filters.term}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="1">First Term</option>
                    <option value="2">Second Term</option>
                    <option value="3">Third Term</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Grades
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      {loading ? (
        <div className="mt-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : grades && grades.length > 0 ? (
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
                        C.A. (30)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Exam (70)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total (100)
                      </th>
                      {filters.term > 1 && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {filters.term === 2 ? "Term 1" : "Previous Terms Avg"}
                        </th>
                      )}
                      {filters.term > 1 && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cumulative
                        </th>
                      )}
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grades.map((grade) => {
                      // Ensure grade has safe defaults
                      const safeGrade = {
                        ...grade,
                        ca: grade.ca || 0,
                        exam: grade.exam || 0,
                        total: grade.total || 0,
                        previousTerms: grade.previousTerms || []
                      }

                      return (
                        <tr key={safeGrade.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{safeGrade.studentName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingGrade === safeGrade.id ? (
                              <input
                                type="number"
                                name="ca"
                                min="0"
                                max="30"
                                value={editForm.ca}
                                onChange={handleEditChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                              />
                            ) : (
                              <div className="text-sm text-gray-900">{safeGrade.ca}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingGrade === safeGrade.id ? (
                              <input
                                type="number"
                                name="exam"
                                min="0"
                                max="70"
                                value={editForm.exam}
                                onChange={handleEditChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                              />
                            ) : (
                              <div className="text-sm text-gray-900">{safeGrade.exam}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {editingGrade === safeGrade.id
                                ? Number.parseInt(editForm.ca || 0) + Number.parseInt(editForm.exam || 0)
                                : safeGrade.total}
                            </div>
                          </td>
                          {filters.term > 1 && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {filters.term === 2
                                  ? getPreviousTermTotal(safeGrade.previousTerms, 0) || "N/A"
                                  : calculatePreviousTermsAverage(safeGrade.previousTerms) || "N/A"}
                              </div>
                            </td>
                          )}
                          {filters.term > 1 && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {filters.term === 2
                                  ? Math.round((safeGrade.total + getPreviousTermTotal(safeGrade.previousTerms, 0)) / 2)
                                  : calculateCumulativeAverage(safeGrade.total, safeGrade.previousTerms)}
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {editingGrade === safeGrade.id ? (
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => handleSaveGrade(safeGrade.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Save
                                </button>
                                <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditClick(safeGrade)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <p className="text-gray-500">
            {filters.classId && filters.subjectId
              ? "No grades found for the selected class and subject."
              : "Select a class and subject to view grades."}
          </p>
        </div>
      )}
    </div>
  )
}

export default ClassGrades