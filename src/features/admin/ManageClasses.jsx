"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash, Users, BookOpen, GraduationCap, Calendar, X } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchClassesData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        classes: [
          {
            id: 1,
            name: "JSS 1A",
            level: "JSS 1",
            arm: "A",
            capacity: 35,
            studentCount: 30,
            classTeacher: "Mr. Oladele",
          },
          {
            id: 2,
            name: "JSS 1B",
            level: "JSS 1",
            arm: "B",
            capacity: 35,
            studentCount: 32,
            classTeacher: "Mr Durosomo",
          },
          {
            id: 3,
            name: "JSS 2A",
            level: "JSS 2",
            arm: "A",
            capacity: 35,
            studentCount: 28,
            classTeacher: "Mr. Adediji",
          },
          {
            id: 4,
            name: "JSS 2B",
            level: "JSS 2",
            arm: "B",
            capacity: 35,
            studentCount: 30,
            classTeacher: "Ms. Adebayo",
          },
          {
            id: 5,
            name: "JSS 3A",
            level: "JSS 3",
            arm: "A",
            capacity: 35,
            studentCount: 25,
            classTeacher: "Mr. Adegbite",
          },
          {
            id: 6,
            name: "JSS 3B",
            level: "JSS 3",
            arm: "B",
            capacity: 35,
            studentCount: 27,
            classTeacher: "Mrs. Ogunleye",
          },
        ],
        teachers: [
          { id: 1, name: "Mr. Oladele" },
          { id: 2, name: "Mr. Durosomo" },
          { id: 3, name: "Mr. Adediji" },
          { id: 4, name: "Ms. Adebayo" },
          { id: 5, name: "Mr. Adegbite" },
          { id: 6, name: "Mrs. Ogunleye" },
          { id: 7, name: "Mr. Anderson" },
          { id: 8, name: "Mrs. Thomas" },
        ],
      })
    }, 1000)
  })
}

const ManageClasses = () => {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    level: "",
    arm: "",
    capacity: 35,
    classTeacher: "",
  })

  useEffect(() => {
    const loadClassesData = async () => {
      try {
        const data = await fetchClassesData()
        setClasses(data.classes)
        setTeachers(data.teachers)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading classes data:", error)
        setIsLoading(false)
      }
    }
    loadClassesData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddClass = () => {
    setEditingClass(null)
    setFormData({
      level: "",
      arm: "",
      capacity: 35,
      classTeacher: "",
    })
    setShowForm(true)
  }

  const handleEditClass = (classItem) => {
    setEditingClass(classItem)
    setFormData({
      level: classItem.level,
      arm: classItem.arm,
      capacity: classItem.capacity,
      classTeacher: classItem.classTeacher,
    })
    setShowForm(true)
  }

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setClasses(classes.filter((c) => c.id !== classId))
      } catch (error) {
        console.error("Error deleting class:", error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.level || !formData.arm) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const className = `${formData.level}${formData.arm}`

      if (editingClass) {
        const updatedClasses = classes.map((c) => {
          if (c.id === editingClass.id) {
            return {
              ...c,
              name: className,
              level: formData.level,
              arm: formData.arm,
              capacity: formData.capacity,
              classTeacher: formData.classTeacher,
            }
          }
          return c
        })
        setClasses(updatedClasses)
      } else {
        const newClass = {
          id: Date.now(),
          name: className,
          level: formData.level,
          arm: formData.arm,
          capacity: formData.capacity,
          studentCount: 0,
          classTeacher: formData.classTeacher,
        }
        setClasses([...classes, newClass])
      }
      setShowForm(false)
    } catch (error) {
      console.error("Error saving class:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCapacityColor = (studentCount, capacity) => {
    const percentage = (studentCount / capacity) * 100
    if (percentage >= 90) return "text-red-600 bg-red-50"
    if (percentage >= 75) return "text-amber-600 bg-amber-50"
    return "text-green-600 bg-green-50"
  }

  const getCapacityBarColor = (studentCount, capacity) => {
    const percentage = (studentCount / capacity) * 100
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-amber-500"
    return "bg-green-500"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading classes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Class Management</h1>
                <p className="text-slate-600">Organize and manage your school classes</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddClass}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Class
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
                <p className="text-slate-600 text-sm">Total Classes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{classes.reduce((sum, c) => sum + c.studentCount, 0)}</p>
                <p className="text-slate-600 text-sm">Total Students</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{classes.filter(c => c.classTeacher).length}</p>
                <p className="text-slate-600 text-sm">Assigned Teachers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{Math.round((classes.reduce((sum, c) => sum + c.studentCount, 0) / classes.reduce((sum, c) => sum + c.capacity, 0)) * 100)}%</p>
                <p className="text-slate-600 text-sm">Capacity Used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingClass ? "Edit Class" : "Add New Class"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SS 1">SS 1</option>
                      <option value="SS 2">SS 2</option>
                      <option value="SS 3">SS 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Arm <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="arm"
                      value={formData.arm}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select Arm</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Class Teacher</label>
                    <select
                      name="classTeacher"
                      value={formData.classTeacher}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.name}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {editingClass ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingClass ? 'Update Class' : 'Add Class'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const capacityPercentage = (classItem.studentCount / classItem.capacity) * 100
            return (
              <div key={classItem.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {classItem.name.split(' ')[1]?.[0] || classItem.arm}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{classItem.name}</h3>
                        <p className="text-slate-500 text-sm">{classItem.level}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditClass(classItem)}
                        className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem.id)}
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600 text-sm">Student Capacity</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCapacityColor(classItem.studentCount, classItem.capacity)}`}>
                        {classItem.studentCount} / {classItem.capacity}
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getCapacityBarColor(classItem.studentCount, classItem.capacity)}`}
                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-slate-600 text-sm">Class Teacher</p>
                        <p className="text-slate-900 font-medium">{classItem.classTeacher || "Not Assigned"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-200/50">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    View Class Details →
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Classes Yet</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first class</p>
            <button
              onClick={handleAddClass}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Class
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageClasses