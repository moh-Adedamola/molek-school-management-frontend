"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash, Search, Users, BookOpen, GraduationCap, X, Menu } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchSubjectsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subjects: [
          {
            id: 1,
            name: "Mathematics",
            code: "MTH",
            description: "Basic mathematics including algebra, geometry, and arithmetic",
            assignedTeachers: ["Mr. Adediji", "Mr Durosomo"],
            assignedClasses: ["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B"],
          },
          {
            id: 2,
            name: "English Language",
            code: "ENG",
            description: "English grammar, comprehension, and literature",
            assignedTeachers: ["Mrs. Pinhero", "Mrs. Ajala"],
            assignedClasses: ["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B"],
          },
          {
            id: 3,
            name: "Basic Science",
            code: "BSC",
            description: "Introduction to scientific concepts and principles",
            assignedTeachers: ["Mr. Oladele"],
            assignedClasses: ["JSS 1A", "JSS 1B"],
          },
          {
            id: 4,
            name: "Social Studies",
            code: "SST",
            description: "Study of society, relationships, and cultures",
            assignedTeachers: ["Mrs. Adebayo" , "Mr. Ojo"],
            assignedClasses: ["JSS 1A", "JSS 1B"],
          },
          {
            id: 5,
            name: "Computer Science",
            code: "CSC",
            description: "Introduction to computers and programming",
            assignedTeachers: ["Mr. Olanrewaju"],
            assignedClasses: ["JSS 2A", "JSS 2B"],
          },
        ],
        teachers: [
          { id: 1, name: "Mr. Adediji" },
          { id: 2, name: "Mrs. Pinhero" },
          { id: 3, name: "Mr. Oladele" },
          { id: 4, name: "Mrs. Adebayo" },
          { id: 5, name: "Mr. Olanrewaju" },
          { id: 6, name: "Mrs. Taylor" },
          { id: 7, name: "Mr. Anderson" },
          { id: 8, name: "Mrs. Thomas" },
        ],
        classes: [
          { id: 1, name: "JSS 1A" },
          { id: 2, name: "JSS 1B" },
          { id: 3, name: "JSS 2A" },
          { id: 4, name: "JSS 2B" },
          { id: 5, name: "JSS 3A" },
          { id: 6, name: "JSS 3B" },
        ],
      })
    }, 1000)
  })
}

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [currentSubject, setCurrentSubject] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  })

  // Assignment form state
  const [assignmentData, setAssignmentData] = useState({
    teacherId: "",
    classIds: [],
  })

  useEffect(() => {
    const loadSubjectsData = async () => {
      try {
        const data = await fetchSubjectsData()
        setSubjects(data.subjects)
        setTeachers(data.teachers)
        setClasses(data.classes)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading subjects data:", error)
        setIsLoading(false)
      }
    }

    loadSubjectsData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target

    if (name === "classIds") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
      setAssignmentData({
        ...assignmentData,
        classIds: selectedOptions,
      })
    } else {
      setAssignmentData({
        ...assignmentData,
        [name]: value,
      })
    }
  }

  const handleAddSubject = () => {
    setEditingSubject(null)
    setFormData({
      name: "",
      code: "",
      description: "",
    })
    setShowForm(true)
  }

  const handleEditSubject = (subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description,
    })
    setShowForm(true)
  }

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setSubjects(subjects.filter((s) => s.id !== subjectId))
      } catch (error) {
        console.error("Error deleting subject:", error)
      }
    }
  }

  const handleOpenAssignmentModal = (subject) => {
    setCurrentSubject(subject)
    setAssignmentData({
      teacherId: "",
      classIds: [],
    })
    setShowAssignmentModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.code) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingSubject) {
        const updatedSubjects = subjects.map((s) => {
          if (s.id === editingSubject.id) {
            return {
              ...s,
              name: formData.name,
              code: formData.code,
              description: formData.description,
            }
          }
          return s
        })
        setSubjects(updatedSubjects)
      } else {
        const newSubject = {
          id: Date.now(),
          name: formData.name,
          code: formData.code,
          description: formData.description,
          assignedTeachers: [],
          assignedClasses: [],
        }
        setSubjects([...subjects, newSubject])
      }

      setShowForm(false)
    } catch (error) {
      console.error("Error saving subject:", error)
    }
  }

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault()

    if (!assignmentData.teacherId || assignmentData.classIds.length === 0) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedTeacher = teachers.find((t) => t.id.toString() === assignmentData.teacherId)

      const updatedSubjects = subjects.map((s) => {
        if (s.id === currentSubject.id) {
          const updatedTeachers = [...s.assignedTeachers]
          if (!updatedTeachers.includes(selectedTeacher.name)) {
            updatedTeachers.push(selectedTeacher.name)
          }

          const updatedClasses = [...s.assignedClasses]
          assignmentData.classIds.forEach((classId) => {
            const className = classes.find((c) => c.id.toString() === classId).name
            if (!updatedClasses.includes(className)) {
              updatedClasses.push(className)
            }
          })

          return {
            ...s,
            assignedTeachers: updatedTeachers,
            assignedClasses: updatedClasses,
          }
        }
        return s
      })

      setSubjects(updatedSubjects)
      setShowAssignmentModal(false)
    } catch (error) {
      console.error("Error assigning teacher:", error)
    }
  }

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <BookOpen className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading subjects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Subject Management</h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">Organize and manage academic subjects</p>
              </div>
            </div>
            <button
              onClick={handleAddSubject}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add Subject</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search size={18} className="sm:w-5 sm:h-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Subject Form */}
        {showForm && (
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {editingSubject ? "Edit Subject" : "Create New Subject"}
                </h2>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter subject name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Subject Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="e.g., MTH, ENG"
                    />
                  </div>
                </div>

                <div className="mb-4 sm:mb-6 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                    rows="3"
                    placeholder="Brief description of the subject"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg text-sm sm:text-base order-1 sm:order-2"
                  >
                    {editingSubject ? "Update Subject" : "Create Subject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs sm:text-sm font-semibold rounded-full">
                          {subject.code}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 break-words">{subject.name}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed break-words">{subject.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap size={14} className="sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">Teachers</span>
                      </div>
                      {subject.assignedTeachers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {subject.assignedTeachers.map((teacher, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full break-words"
                            >
                              {teacher}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs sm:text-sm">No teachers assigned</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Users size={14} className="sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">Classes</span>
                      </div>
                      {subject.assignedClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {subject.assignedClasses.map((cls, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs sm:text-sm">No classes assigned</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-1 sm:space-x-2 pt-3 sm:pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleOpenAssignmentModal(subject)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 touch-manipulation"
                      title="Assign Teacher"
                    >
                      <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 touch-manipulation"
                      title="Edit Subject"
                    >
                      <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 touch-manipulation"
                      title="Delete Subject"
                    >
                      <Trash size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-8 sm:py-12">
                <BookOpen size={40} className="sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-slate-500 mb-2">No subjects found</h3>
                <p className="text-slate-400 text-sm sm:text-base">Create your first subject to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && currentSubject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-white truncate pr-4">
                    Assign to {currentSubject.name}
                  </h2>
                  <button
                    onClick={() => setShowAssignmentModal(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-1 transition-all duration-200 flex-shrink-0 touch-manipulation"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-6 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Select Teacher <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="teacherId"
                    value={assignmentData.teacherId}
                    onChange={handleAssignmentChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Choose a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 sm:mb-6 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Select Classes <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="classIds"
                    multiple
                    value={assignmentData.classIds}
                    onChange={handleAssignmentChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-24 sm:h-32 text-sm sm:text-base"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">Hold and tap to select multiple classes</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignmentModal(false)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAssignmentSubmit} 
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg text-sm sm:text-base order-1 sm:order-2"
                  >
                    Assign Teacher
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Enhanced touch targets for mobile */
        @media (max-width: 640px) {
          .touch-manipulation {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Prevent horizontal scrolling on very small screens */
        @media (max-width: 320px) {
          .break-words {
            word-break: break-word;
            overflow-wrap: break-word;
          }
        }
      `}</style>
    </div>
  )
}

export default ManageSubjects