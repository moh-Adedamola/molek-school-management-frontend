"use client"

import { useState, useEffect, useCallback } from "react"
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

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchClasses())
    dispatch(fetchSubjects())
  }, [dispatch])

  // Handle filter changes
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: name === "term" ? Number(value) : value,
    }))
  }, [])

  // Handle grade search
  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (filters.classId && filters.subjectId) {
      dispatch(fetchGrades(filters))
    }
  }, [dispatch, filters])

  // Handle edit click
  const handleEditClick = useCallback((grade) => {
    setEditingGrade(grade.id)
    setEditForm({
      ca: grade.ca || 0,
      exam: grade.exam || 0,
    })
  }, [])

  // Handle edit form changes with validation
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target
    let numValue = Math.max(0, parseInt(value, 10) || 0)
    
    if (name === "ca") numValue = Math.min(numValue, 30)
    if (name === "exam") numValue = Math.min(numValue, 70)

    setEditForm(prev => ({
      ...prev,
      [name]: numValue,
    }))
  }, [])

  // Save grade changes
  const handleSaveGrade = useCallback((gradeId) => {
    const gradeToUpdate = {
      id: gradeId,
      ca: editForm.ca,
      exam: editForm.exam,
    }

    dispatch(updateGrade(gradeToUpdate)).then(() => {
      setEditingGrade(null)
    })
  }, [dispatch, editForm])

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingGrade(null)
  }, [])

  // Calculate previous terms average
  const calculatePreviousTermsAverage = useCallback((previousTerms) => {
    if (!Array.isArray(previousTerms)) return 0
    const validTerms = previousTerms.filter(term => term?.total !== undefined)
    if (validTerms.length === 0) return 0
    const total = validTerms.reduce((sum, term) => sum + term.total, 0)
    return Math.round(total / validTerms.length)
  }, [])

  // Get specific previous term total
  const getPreviousTermTotal = useCallback((previousTerms, index = 0) => {
    if (!Array.isArray(previousTerms)) return 0
    return previousTerms[index]?.total || 0
  }, [])

  // Calculate cumulative average
  const calculateCumulativeAverage = useCallback((currentTotal, previousTerms) => {
    if (!Array.isArray(previousTerms)) return currentTotal
    const validTerms = previousTerms.filter(term => term?.total !== undefined)
    if (validTerms.length === 0) return currentTotal
    const previousTotal = validTerms.reduce((sum, term) => sum + term.total, 0)
    return Math.round((currentTotal + previousTotal) / (validTerms.length + 1))
  }, [])

  // Filter classes and subjects based on teacher assignments
  const teacherClasses = classes || []
  const teacherSubjects = subjects || []

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Class Grades</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and update student grades for your assigned classes and subjects
        </p>
      </header>

      <GradeFilters
        classes={teacherClasses}
        subjects={teacherSubjects}
        filters={filters}
        onChange={handleFilterChange}
        onSubmit={handleSearch}
      />

      {error ? (
        <ErrorMessage message={error} />
      ) : grades?.length > 0 ? (
        <GradesTable
          grades={grades}
          term={filters.term}
          editingGrade={editingGrade}
          editForm={editForm}
          onEditChange={handleEditChange}
          onEditClick={handleEditClick}
          onSave={handleSaveGrade}
          onCancel={handleCancelEdit}
          calculatePreviousTermsAverage={calculatePreviousTermsAverage}
          getPreviousTermTotal={getPreviousTermTotal}
          calculateCumulativeAverage={calculateCumulativeAverage}
        />
      ) : (
        <EmptyState hasFilters={!!filters.classId && !!filters.subjectId} />
      )}
    </div>
  )
}

// Sub-components for better organization
const GradeFilters = ({ classes, subjects, filters, onChange, onSubmit }) => (
  <div className="bg-white shadow rounded-lg p-6 mb-8">
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <h2 className="text-lg font-medium text-gray-900">Select Class and Subject</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose the class, subject, and term to view and manage grades.
        </p>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-2">
              <SelectInput
                id="classId"
                label="Class"
                name="classId"
                value={filters.classId}
                onChange={onChange}
                options={classes}
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <SelectInput
                id="subjectId"
                label="Subject"
                name="subjectId"
                value={filters.subjectId}
                onChange={onChange}
                options={subjects}
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <SelectInput
                id="term"
                label="Term"
                name="term"
                value={filters.term}
                onChange={onChange}
                options={[
                  { id: 1, name: "First Term" },
                  { id: 2, name: "Second Term" },
                  { id: 3, name: "Third Term" },
                ]}
              />
            </div>

            <div className="col-span-6">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                View Grades
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)

const SelectInput = ({ id, label, name, value, onChange, options, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
)

const GradesTable = ({
  grades,
  term,
  editingGrade,
  editForm,
  onEditClick,
  onEditChange,
  onSave,
  onCancel,
  calculatePreviousTermsAverage,
  getPreviousTermTotal,
  calculateCumulativeAverage,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Student</TableHeader>
              <TableHeader>C.A. (30)</TableHeader>
              <TableHeader>Exam (70)</TableHeader>
              <TableHeader>Total (100)</TableHeader>
              {term > 1 && (
                <TableHeader>{term === 2 ? "Term 1" : "Previous Terms Avg"}</TableHeader>
              )}
              {term > 1 && <TableHeader>Cumulative</TableHeader>}
              <TableHeader align="right">Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.map((grade) => {
              const safeGrade = {
                ...grade,
                ca: grade.ca || 0,
                exam: grade.exam || 0,
                total: grade.total || 0,
                previousTerms: grade.previousTerms || []
              }

              return (
                <GradeRow
                  key={safeGrade.id}
                  grade={safeGrade}
                  term={term}
                  isEditing={editingGrade === safeGrade.id}
                  editForm={editForm}
                  onEditClick={onEditClick}
                  onEditChange={onEditChange}
                  onSave={onSave}
                  onCancel={onCancel}
                  calculatePreviousTermsAverage={calculatePreviousTermsAverage}
                  getPreviousTermTotal={getPreviousTermTotal}
                  calculateCumulativeAverage={calculateCumulativeAverage}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const GradeRow = ({
  grade,
  term,
  isEditing,
  editForm,
  onEditClick,
  onEditChange,
  onSave,
  onCancel,
  calculatePreviousTermsAverage,
  getPreviousTermTotal,
  calculateCumulativeAverage,
}) => {
  const currentTotal = isEditing ? editForm.ca + editForm.exam : grade.total
  const previousTermDisplay = term === 2
    ? getPreviousTermTotal(grade.previousTerms, 0)
    : calculatePreviousTermsAverage(grade.previousTerms)
  const cumulativeAverage = calculateCumulativeAverage(currentTotal, grade.previousTerms)

  return (
    <tr>
      <TableCell>{grade.studentName}</TableCell>
      
      <TableCell>
        {isEditing ? (
          <NumberInput
            name="ca"
            value={editForm.ca}
            onChange={onEditChange}
            min={0}
            max={30}
          />
        ) : (
          grade.ca
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <NumberInput
            name="exam"
            value={editForm.exam}
            onChange={onEditChange}
            min={0}
            max={70}
          />
        ) : (
          grade.exam
        )}
      </TableCell>
      
      <TableCell>{currentTotal}</TableCell>
      
      {term > 1 && <TableCell>{previousTermDisplay || "N/A"}</TableCell>}
      {term > 1 && <TableCell>{cumulativeAverage}</TableCell>}
      
      <TableCell align="right">
        {isEditing ? (
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => onSave(grade.id)}
              className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => onEditClick(grade)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            Edit
          </button>
        )}
      </TableCell>
    </tr>
  )
}

const TableHeader = ({ children, align = "left" }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
      align === "right" ? "text-right" : ""
    }`}
  >
    {children}
  </th>
)

const TableCell = ({ children, align = "left" }) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm ${
      align === "right" ? "text-right" : ""
    }`}
  >
    {children}
  </td>
)

const NumberInput = ({ name, value, onChange, min, max }) => (
  <input
    type="number"
    name={name}
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
)

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
    <p className="text-sm text-red-700">{message}</p>
  </div>
)

const EmptyState = ({ hasFilters }) => (
  <div className="bg-white shadow rounded-md p-6 text-center">
    <p className="text-gray-500">
      {hasFilters
        ? "No grades found for the selected class and subject."
        : "Select a class and subject to view grades."}
    </p>
  </div>
)

export default ClassGrades