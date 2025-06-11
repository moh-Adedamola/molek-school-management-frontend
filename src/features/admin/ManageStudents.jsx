"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash, Search, X, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchStudentsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        students: [
          {
            id: 1,
            name: "Tadese Maryam",
            admissionNumber: "STD2022001",
            class: "JSS 1A",
            gender: "Female",
            parentName: "Mr and Mrs Tadese",
            parentEmail: "parent1@example.com",
          },
          {
            id: 2,
            name: "Adepoju Fareedah",
            admissionNumber: "STD2022002",
            class: "JSS 2B",
            gender: "Female",
            parentName: "Mr and Mrs Adepoju",
            parentEmail: "parent2@example.com",
          },
          {
            id: 3,
            name: "Idris Sharif",
            admissionNumber: "STD2022003",
            class: "JSS 3A",
            gender: "Male",
            parentName: "Mr and Mrs Idris",
            parentEmail: "parent3@example.com",
          },
          {
            id: 4,
            name: "Abiona Aisha",
            admissionNumber: "STD2022004",
            class: "JSS 1A",
            gender: "Female",
            parentName: "Mr and Mrs Abiona",
            parentEmail: "parent4@example.com",
          },
          {
            id: 5,
            name: "David Wilson",
            admissionNumber: "STD2022005",
            class: "JSS 2B",
            gender: "Male",
            parentName: "Mr. Wilson",
            parentEmail: "parent5@example.com",
          },
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

const ManageStudents = () => {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    dateOfBirth: "",
    admissionNumber: "",
    class: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
  })

  useEffect(() => {
    const loadStudentsData = async () => {
      try {
        const data = await fetchStudentsData()
        setStudents(data.students)
        setClasses(data.classes)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading students data:", error)
        setIsLoading(false)
      }
    }

    loadStudentsData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddStudent = () => {
    setEditingStudent(null)
    setFormData({
      name: "",
      gender: "Male",
      dateOfBirth: "",
      admissionNumber: "",
      class: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
    })
    setShowForm(true)
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth || "",
      admissionNumber: student.admissionNumber,
      class: student.class,
      parentName: student.parentName || "",
      parentEmail: student.parentEmail || "",
      parentPhone: student.parentPhone || "",
      address: student.address || "",
    })
    setShowForm(true)
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        // Mock API call - replace with actual API call in production
        await new Promise((resolve) => setTimeout(resolve, 500))

        setStudents(students.filter((student) => student.id !== studentId))
      } catch (error) {
        console.error("Error deleting student:", error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.admissionNumber || !formData.class) {
      return
    }

    setIsSubmitting(true)

    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingStudent) {
        // Update existing student
        const updatedStudents = students.map((student) => {
          if (student.id === editingStudent.id) {
            return { ...student, ...formData }
          }
          return student
        })
        setStudents(updatedStudents)
      } else {
        // Add new student
        const newStudent = {
          id: Date.now(), // Mock ID generation
          ...formData,
        }
        setStudents([...students, newStudent])
      }

      setShowForm(false)
    } catch (error) {
      console.error("Error saving student:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500/20 border-t-blue-500 mx-auto"></div>
          <p className="text-gray-500 text-sm">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">Manage student records and information</p>
          </div>
          <button
            onClick={handleAddStudent}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-12 pr-4 py-3 bg-white border-0 rounded-xl shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Student Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User size={20} className="text-blue-600" />
                      Student Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admission Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="admissionNumber"
                          value={formData.admissionNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="class"
                          value={formData.class}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.name}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users size={20} className="text-green-600" />
                      Parent/Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name</label>
                        <input
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Email</label>
                        <input
                          type="email"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Phone</label>
                        <input
                          type="tel"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>}
                      {editingStudent ? "Update Student" : "Add Student"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Admission No.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Parent/Guardian</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-mono">{student.admissionNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{student.gender}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.parentName}</div>
                          <div className="text-sm text-gray-500">{student.parentEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit student"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete student"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Users size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your search or add a new student</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>
    </div>
  )
}

export default ManageStudents