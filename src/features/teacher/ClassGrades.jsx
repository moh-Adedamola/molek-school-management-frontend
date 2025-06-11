"use client"

import { useState, useCallback, useMemo } from "react"
import { BookOpen, Award, TrendingUp, Edit3, Save, X, Filter, Users, Target, BarChart3, Trophy, Medal } from "lucide-react"

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

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: name === "term" ? Number(value) : value,
    }))
  }, [])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (filters.classId && filters.subjectId) {
      setLoading(true)
      setTimeout(() => {
        setGrades(mockData.grades)
        setLoading(false)
      }, 1000)
    }
  }, [filters])

  const handleEditClick = useCallback((grade) => {
    setEditingGrade(grade.id)
    setEditForm({
      ca: grade.ca || 0,
      exam: grade.exam || 0,
    })
  }, [])

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target
    let numValue = Math.max(0, parseInt(value, 10) || 0)
    
    if (name === "ca") {
      numValue = Math.min(numValue, 30)
    }
    if (name === "exam") {
      numValue = Math.min(numValue, 70)
    }

    setEditForm(prev => ({
      ...prev,
      [name]: numValue,
    }))
  }, [])

  const handleSaveGrade = useCallback((gradeId) => {
    setGrades(prev => prev.map(grade => 
      grade.id === gradeId 
        ? { ...grade, ca: editForm.ca, exam: editForm.exam, total: editForm.ca + editForm.exam }
        : grade
    ))
    setEditingGrade(null)
  }, [editForm])

  const handleCancelEdit = useCallback(() => {
    setEditingGrade(null)
  }, [])

  const getTermGrades = useCallback((previousTerms, currentTerm) => {
    if (!Array.isArray(previousTerms)) return [];
    
    if (currentTerm === 2) {
      return previousTerms.length >= 1 ? [previousTerms[0].total] : [];
    }
    if (currentTerm === 3) {
      return previousTerms.length >= 2 ? [previousTerms[0].total, previousTerms[1].total] : [];
    }
    return [];
  }, []);

  const calculateCumulativeTotal = useCallback((currentTotal, previousTerms, currentTerm) => {
    if (!Array.isArray(previousTerms)) return currentTotal;
    
    if (currentTerm === 2) {
      return previousTerms.length >= 1 ? currentTotal + previousTerms[0].total : currentTotal;
    }
    if (currentTerm === 3) {
      return previousTerms.length >= 2 ? 
        currentTotal + previousTerms[0].total + previousTerms[1].total : 
        currentTotal;
    }
    return currentTotal;
  }, []);

  const calculateCumulativeAverage = useCallback((currentTotal, previousTerms, currentTerm) => {
    const cumulativeTotal = calculateCumulativeTotal(currentTotal, previousTerms, currentTerm);
    const divisor = currentTerm === 2 ? 2 : 3;
    return Math.round(cumulativeTotal / divisor);
  }, [calculateCumulativeTotal]);

  // Calculate positions for current term and cumulative average
  const gradesWithPositions = useMemo(() => {
    if (!grades.length) return [];
    
    // Calculate current term positions
    const sortedByCurrentTerm = [...grades].sort((a, b) => {
      const totalA = editingGrade === a.id ? editForm.ca + editForm.exam : a.total;
      const totalB = editingGrade === b.id ? editForm.ca + editForm.exam : b.total;
      return totalB - totalA;
    });
    
    // Calculate cumulative average positions (only for term 2 and 3)
    const sortedByCumulative = filters.term > 1 ? [...grades].sort((a, b) => {
      const totalA = editingGrade === a.id ? editForm.ca + editForm.exam : a.total;
      const totalB = editingGrade === b.id ? editForm.ca + editForm.exam : b.total;
      const avgA = calculateCumulativeAverage(totalA, a.previousTerms, filters.term);
      const avgB = calculateCumulativeAverage(totalB, b.previousTerms, filters.term);
      return avgB - avgA;
    }) : [];

    return grades.map(grade => {
      const currentTotal = editingGrade === grade.id ? editForm.ca + editForm.exam : grade.total;
      const currentTermPosition = sortedByCurrentTerm.findIndex(g => g.id === grade.id) + 1;
      
      let cumulativePosition = null;
      if (filters.term > 1) {
        cumulativePosition = sortedByCumulative.findIndex(g => g.id === grade.id) + 1;
      }

      return {
        ...grade,
        currentTermPosition,
        cumulativePosition,
        currentTotal
      };
    });
  }, [grades, editingGrade, editForm, filters.term, calculateCumulativeAverage]);

  const stats = grades.length > 0 ? {
    totalStudents: grades.length,
    averageScore: Math.round(grades.reduce((sum, grade) => sum + grade.total, 0) / grades.length),
    highestScore: Math.max(...grades.map(g => g.total)),
    lowestScore: Math.min(...grades.map(g => g.total))
  } : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extralight text-slate-900 tracking-tight">Class Grades</h1>
              <p className="text-slate-500 text-sm mt-1">Track academic performance with precision</p>
            </div>
          </div>
        </div>

        <GradeFilters
          classes={classes}
          subjects={subjects}
          filters={filters}
          onChange={handleFilterChange}
          onSubmit={handleSearch}
          loading={loading}
        />

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Students"
              value={stats.totalStudents}
              color="from-slate-400 to-slate-600"
            />
            <StatCard
              icon={BarChart3}
              label="Average"
              value={`${stats.averageScore}%`}
              color="from-indigo-400 to-indigo-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Highest"
              value={`${stats.highestScore}%`}
              color="from-emerald-400 to-emerald-600"
            />
            <StatCard
              icon={Target}
              label="Lowest"
              value={`${stats.lowestScore}%`}
              color="from-rose-400 to-rose-600"
            />
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-slate-600 font-light">Loading grades...</span>
            </div>
          </div>
        )}

        {error ? (
          <ErrorMessage message={error} />
        ) : gradesWithPositions?.length > 0 && !loading ? (
          <GradesTable
            grades={gradesWithPositions}
            term={filters.term}
            editingGrade={editingGrade}
            editForm={editForm}
            onEditChange={handleEditChange}
            onEditClick={handleEditClick}
            onSave={handleSaveGrade}
            onCancel={handleCancelEdit}
            getTermGrades={getTermGrades}
            calculateCumulativeTotal={calculateCumulativeTotal}
            calculateCumulativeAverage={calculateCumulativeAverage}
          />
        ) : !loading && (
          <EmptyState hasFilters={!!filters.classId && !!filters.subjectId} />
        )}
      </div>
    </div>
  )
}

const GradeFilters = ({ classes, subjects, filters, onChange, onSubmit, loading }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mb-8 shadow-xl shadow-slate-100/50">
    <div className="flex items-center gap-3 mb-6">
      <Filter className="w-5 h-5 text-slate-400" />
      <h2 className="text-lg font-light text-slate-900">Filters</h2>
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
          className="group px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-light rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
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
  <div className="space-y-3">
    <label htmlFor={id} className="text-sm font-light text-slate-600 block">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/50 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 appearance-none cursor-pointer hover:border-slate-300"
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

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="group bg-white/70 backdrop-blur-sm hover:bg-white/90 rounded-2xl border border-white/30 p-6 shadow-lg shadow-slate-100/30 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-light text-slate-500 mb-2 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extralight text-slate-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
)

const PositionBadge = ({ position, type }) => {
  const getPositionStyle = (pos) => {
    if (pos === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg"
    if (pos === 2) return "bg-gradient-to-r from-slate-400 to-slate-600 text-white shadow-md"
    if (pos === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md"
    return "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 shadow-sm"
  }

  const getPositionIcon = (pos) => {
    if (pos === 1) return <Trophy className="w-3 h-3" />
    if (pos === 2 || pos === 3) return <Medal className="w-3 h-3" />
    return null
  }

  const getOrdinal = (num) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return num + "st"
    if (j === 2 && k !== 12) return num + "nd"
    if (j === 3 && k !== 13) return num + "rd"
    return num + "th"
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getPositionStyle(position)}`}>
        {getPositionIcon(position)}
        <span>{getOrdinal(position)}</span>
      </div>
      <span className="text-xs text-slate-400 font-light">{type}</span>
    </div>
  )
}

const GradesTable = ({
  grades,
  term,
  editingGrade,
  editForm,
  onEditChange,
  onEditClick,
  onSave,
  onCancel,
  getTermGrades,
  calculateCumulativeTotal,
  calculateCumulativeAverage,
}) => {
  const getGradeColor = (score) => {
    if (score >= 90) return "text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200"
    if (score >= 80) return "text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
    if (score >= 70) return "text-amber-700 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
    if (score >= 60) return "text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200"
    return "text-rose-700 bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200"
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-xl shadow-slate-100/50">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-light text-slate-900">
            Grade Management - Term {term}
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/30">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-light text-slate-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                C.A. (30)
              </th>
              <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                Exam (70)
              </th>
              <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                Total (100)
              </th>
              <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                Current Position
              </th>
              {term > 1 && (
                <>
                  <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                    Term 1
                  </th>
                  {term >= 2 && (
                    <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                      Term 2
                    </th>
                  )}
                  {term === 3 && (
                    <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                      Term 3
                    </th>
                  )}
                  <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                    {term === 2 ? 'Cumulative (200)' : 'Cumulative (300)'}
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                    Average (100)
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-light text-slate-500 uppercase tracking-wider">
                    Avg Position
                  </th>
                </>
              )}
              <th className="px-8 py-4 text-right text-xs font-light text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {grades.map((grade) => {
              const safeGrade = {
                ...grade,
                ca: grade.ca || 0,
                exam: grade.exam || 0,
                total: grade.total || 0,
                previousTerms: grade.previousTerms || []
              }

              const currentTotal = editingGrade === safeGrade.id ? editForm.ca + editForm.exam : safeGrade.total;
              const termGrades = getTermGrades(safeGrade.previousTerms, term);
              const cumulativeTotal = calculateCumulativeTotal(currentTotal, safeGrade.previousTerms, term);
              const cumulativeAverage = calculateCumulativeAverage(currentTotal, safeGrade.previousTerms, term);

              return (
                <tr key={safeGrade.id} className="hover:bg-slate-50/30 transition-all duration-200 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                        <span className="text-sm font-medium text-slate-600">
                          {safeGrade.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{safeGrade.studentName}</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-6 text-center">
                    {editingGrade === safeGrade.id ? (
                      <NumberInput
                        name="ca"
                        value={editForm.ca}
                        onChange={onEditChange}
                        min={0}
                        max={30}
                      />
                    ) : (
                      <span className={`px-3 py-2 rounded-xl text-sm font-medium border ${getGradeColor(safeGrade.ca)}`}>
                        {safeGrade.ca}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-4 py-6 text-center">
                    {editingGrade === safeGrade.id ? (
                      <NumberInput
                        name="exam"
                        value={editForm.exam}
                        onChange={onEditChange}
                        min={0}
                        max={70}
                      />
                    ) : (
                      <span className={`px-3 py-2 rounded-xl text-sm font-medium border ${getGradeColor(safeGrade.exam)}`}>
                        {safeGrade.exam}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-4 py-6 text-center">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getGradeColor(currentTotal)}`}>
                      {currentTotal}
                    </span>
                  </td>

                  <td className="px-4 py-6 text-center">
                    <PositionBadge position={grade.currentTermPosition} type="Current" />
                  </td>
                  
                  {term > 1 && (
                    <>
                      <td className="px-4 py-6 text-center">
                        <span className="text-sm text-slate-600 font-light">
                          {termGrades[0] || "N/A"}
                        </span>
                      </td>
                      {term >= 2 && (
                        <td className="px-4 py-6 text-center">
                          <span className="text-sm text-slate-600 font-light">
                            {term === 2 ? currentTotal : termGrades[1] || "N/A"}
                          </span>
                        </td>
                      )}
                      {term === 3 && (
                        <td className="px-4 py-6 text-center">
                          <span className="text-sm text-slate-600 font-light">
                            {currentTotal}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-6 text-center">
                        <span className={`px-3 py-2 rounded-xl text-sm font-medium border ${getGradeColor(cumulativeTotal / (term === 2 ? 2 : 3))}`}>
                          {cumulativeTotal}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className={`px-3 py-2 rounded-xl text-sm font-medium border ${getGradeColor(cumulativeAverage)}`}>
                          {cumulativeAverage}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <PositionBadge position={grade.cumulativePosition} type="Average" />
                      </td>
                    </>
                  )}
                  
                  <td className="px-8 py-6 text-right">
                    {editingGrade === safeGrade.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => onSave(safeGrade.id)}
                          className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-600 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center shadow-sm hover:shadow-md"
                          title="Save changes"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={onCancel}
                          className="w-10 h-10 bg-gradient-to-r from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 text-rose-600 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center shadow-sm hover:shadow-md"
                          title="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEditClick(safeGrade)}
                        className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 text-indigo-600 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center shadow-sm hover:shadow-md"
                        title="Edit grade"
                      >
                        <Edit3 className="w-4 h-4" />
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
    className="w-20 px-3 py-2 bg-slate-50/50 border border-slate-200/50 rounded-xl text-center text-sm focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-200"
  />
)

const ErrorMessage = ({ message }) => (
  <div className="bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/50 rounded-3xl p-8 mb-8 shadow-lg">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
        <X className="w-6 h-6 text-white" />
      </div>
      <p className="text-rose-700 font-medium">{message}</p>
    </div>
  </div>
)

const EmptyState = ({ hasFilters }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-20 text-center shadow-xl shadow-slate-100/50">
    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
      <BookOpen className="w-10 h-10 text-slate-400" />
    </div>
    <h3 className="text-xl font-light text-slate-900 mb-3">
      {hasFilters ? "No Grades Found" : "Select Class and Subject"}
    </h3>
    <p className="text-slate-500 max-w-md mx-auto font-light leading-relaxed">
      {hasFilters
        ? "No grades found for the selected class and subject. Students may not be enrolled or grades haven't been entered yet."
        : "Choose a class and subject from the filters above to view and manage student grades."}
    </p>
  </div>
)

export default ClassGrades