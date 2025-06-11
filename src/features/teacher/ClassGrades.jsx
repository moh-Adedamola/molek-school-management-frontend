"use client"

import { useState, useEffect, useCallback } from "react"
import { BookOpen, Award, TrendingUp, Edit3, Save, X, Filter, Users, Target, BarChart3 } from "lucide-react"

// Mock data and services to simulate Redux state
const mockData = {
  classes: [
    { id: 1, name: "JSS 1A" },
    { id: 2, name: "JSS 2B" },
    { id: 3, name: "JSS 3A" },
  ],
  subjects: [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "English Language" },
    { id: 3, name: "Basic Science" },
  ],
  grades: [
    {
      id: 1,
      studentName: "John Doe",
      ca: 25,
      exam: 65,
      total: 90,
      previousTerms: [{ total: 85 }, { total: 78 }]
    },
    {
      id: 2,
      studentName: "Jane Smith",
      ca: 28,
      exam: 58,
      total: 86,
      previousTerms: [{ total: 82 }, { total: 79 }]
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      ca: 22,
      exam: 55,
      total: 77,
      previousTerms: [{ total: 74 }, { total: 71 }]
    },
    {
      id: 4,
      studentName: "Sarah Wilson",
      ca: 30,
      exam: 62,
      total: 92,
      previousTerms: [{ total: 88 }, { total: 85 }]
    },
    {
      id: 5,
      studentName: "David Brown",
      ca: 20,
      exam: 48,
      total: 68,
      previousTerms: [{ total: 65 }, { total: 62 }]
    }
  ]
}

const ClassGrades = () => {
  const [grades, setGrades] = useState([])
  const [classes] = useState(mockData.classes)
  const [subjects] = useState(mockData.subjects)
  const [loading, setLoading] = useState(false)
  const [error] = useState(null)

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
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setGrades(mockData.grades)
        setLoading(false)
      }, 1000)
    }
  }, [filters])

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
    setGrades(prev => prev.map(grade => 
      grade.id === gradeId 
        ? { ...grade, ca: editForm.ca, exam: editForm.exam, total: editForm.ca + editForm.exam }
        : grade
    ))
    setEditingGrade(null)
  }, [editForm])

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

  // Calculate statistics
  const stats = grades.length > 0 ? {
    totalStudents: grades.length,
    averageScore: Math.round(grades.reduce((sum, grade) => sum + grade.total, 0) / grades.length),
    highestScore: Math.max(...grades.map(g => g.total)),
    lowestScore: Math.min(...grades.map(g => g.total))
  } : null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-light text-slate-900">Class Grades</h1>
          </div>
          <p className="text-slate-600 ml-13">Manage and track student academic performance</p>
        </div>

        {/* Filters */}
        <GradeFilters
          classes={classes}
          subjects={subjects}
          filters={filters}
          onChange={handleFilterChange}
          onSubmit={handleSearch}
          loading={loading}
        />

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Students"
              value={stats.totalStudents}
              color="slate"
            />
            <StatCard
              icon={BarChart3}
              label="Class Average"
              value={`${stats.averageScore}%`}
              color="indigo"
            />
            <StatCard
              icon={TrendingUp}
              label="Highest Score"
              value={`${stats.highestScore}%`}
              color="emerald"
            />
            <StatCard
              icon={Target}
              label="Lowest Score"
              value={`${stats.lowestScore}%`}
              color="rose"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-sm">Loading grades...</span>
            </div>
          </div>
        )}

        {/* Content */}
        {error ? (
          <ErrorMessage message={error} />
        ) : grades?.length > 0 && !loading ? (
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
        ) : !loading && (
          <EmptyState hasFilters={!!filters.classId && !!filters.subjectId} />
        )}
      </div>
    </div>
  )
}

// Components
const GradeFilters = ({ classes, subjects, filters, onChange, onSubmit, loading }) => (
  <div className="bg-white rounded-2xl border border-slate-200/60 p-8 mb-8 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <Filter className="w-5 h-5 text-slate-500" />
      <h2 className="text-lg font-medium text-slate-900">Select Class and Subject</h2>
    </div>
    
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SelectInput
          id="classId"
          label="Class"
          name="classId"
          value={filters.classId}
          onChange={onChange}
          options={classes}
          required
        />

        <SelectInput
          id="subjectId"
          label="Subject"
          name="subjectId"
          value={filters.subjectId}
          onChange={onChange}
          options={subjects}
          required
        />

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

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={loading || !filters.classId || !filters.subjectId}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            "View Grades"
          )}
        </button>
      </div>
    </div>
  </div>
)

const SelectInput = ({ id, label, name, value, onChange, options, required = false }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-slate-700">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 appearance-none cursor-pointer"
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

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
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
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-medium text-slate-900">
            Grade Management - Term {term}
          </h2>
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
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                C.A. (30)
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Exam (70)
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total (100)
              </th>
              {term > 1 && (
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {term === 2 ? "Term 1" : "Previous Avg"}
                </th>
              )}
              {term > 1 && (
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cumulative
                </th>
              )}
              <th className="px-8 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grades.map((grade, index) => {
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
                  isLast={index === grades.length - 1}
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
  isLast
}) => {
  const currentTotal = isEditing ? editForm.ca + editForm.exam : grade.total
  const previousTermDisplay = term === 2
    ? getPreviousTermTotal(grade.previousTerms, 0)
    : calculatePreviousTermsAverage(grade.previousTerms)
  const cumulativeAverage = calculateCumulativeAverage(currentTotal, grade.previousTerms)

  const getGradeColor = (score) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50"
    if (score >= 70) return "text-blue-700 bg-blue-50"
    if (score >= 60) return "text-amber-700 bg-amber-50"
    return "text-rose-700 bg-rose-50"
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors duration-150">
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-slate-600">
              {grade.studentName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-900">{grade.studentName}</span>
        </div>
      </td>
      
      <td className="px-6 py-5 text-center">
        {isEditing ? (
          <NumberInput
            name="ca"
            value={editForm.ca}
            onChange={onEditChange}
            min={0}
            max={30}
          />
        ) : (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.ca)}`}>
            {grade.ca}
          </span>
        )}
      </td>
      
      <td className="px-6 py-5 text-center">
        {isEditing ? (
          <NumberInput
            name="exam"
            value={editForm.exam}
            onChange={onEditChange}
            min={0}
            max={70}
          />
        ) : (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.exam)}`}>
            {grade.exam}
          </span>
        )}
      </td>
      
      <td className="px-6 py-5 text-center">
        <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getGradeColor(currentTotal)}`}>
          {currentTotal}
        </span>
      </td>
      
      {term > 1 && (
        <td className="px-6 py-5 text-center">
          <span className="text-sm text-slate-600">
            {previousTermDisplay || "N/A"}
          </span>
        </td>
      )}
      
      {term > 1 && (
        <td className="px-6 py-5 text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(cumulativeAverage)}`}>
            {cumulativeAverage}
          </span>
        </td>
      )}
      
      <td className="px-8 py-5 text-right">
        {isEditing ? (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => onSave(grade.id)}
              className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
              title="Save changes"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="w-8 h-8 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
              title="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onEditClick(grade)}
            className="w-8 h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
            title="Edit grade"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  )
}

const NumberInput = ({ name, value, onChange, min, max }) => (
  <input
    type="number"
    name={name}
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
  />
)

const ErrorMessage = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-8">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
        <X className="w-5 h-5 text-rose-600" />
      </div>
      <p className="text-rose-700 font-medium">{message}</p>
    </div>
  </div>
)

const EmptyState = ({ hasFilters }) => (
  <div className="bg-white rounded-2xl border border-slate-200/60 p-16 text-center shadow-sm">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <BookOpen className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-medium text-slate-900 mb-2">
      {hasFilters ? "No Grades Found" : "Select Class and Subject"}
    </h3>
    <p className="text-slate-600 max-w-md mx-auto">
      {hasFilters
        ? "No grades found for the selected class and subject. Students may not be enrolled or grades haven't been entered yet."
        : "Choose a class and subject from the filters above to view and manage student grades."}
    </p>
  </div>
)

export default ClassGrades