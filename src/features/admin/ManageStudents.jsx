"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Plus, Edit, Trash, Search } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchStudentsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        students: [
          {
            id: 1,
            name: "John Doe",
            admissionNumber: "STD2022001",
            class: "JSS 1A",
            gender: "Male",
            parentName: "Mr. Doe",
            parentEmail: "parent1@example.com",
          },
          {
            id: 2,
            name: "Jane Smith",
            admissionNumber: "STD2022002",
            class: "JSS 2B",
            gender: "Female",
            parentName: "Mrs. Smith",
            parentEmail: "parent2@example.com",
          },
          {
            id: 3,
            name: "Michael Johnson",
            admissionNumber: "STD2022003",
            class: "JSS 3A",
            gender: "Male",
            parentName: "Mr. Johnson",
            parentEmail: "parent3@example.com",
          },
          {
            id: 4,
            name: "Emily Brown",
            admissionNumber: "STD2022004",
            class: "JSS 1A",
            gender: "Female",
            parentName: "Mrs. Brown",
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
        toast.error("Failed to load students data")
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
        toast.success("Student deleted successfully")
      } catch (error) {
        console.error("Error deleting student:", error)
        toast.error("Failed to delete student")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.admissionNumber || !formData.class) {
      toast.error("Please fill in all required fields")
      return
    }

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
        toast.success("Student updated successfully")
      } else {
        // Add new student
        const newStudent = {
          id: Date.now(), // Mock ID generation
          ...formData,
        }
        setStudents([...students, newStudent])
        toast.success("Student added successfully")
      }

      setShowForm(false)
    } catch (error) {
      console.error("Error saving student:", error)
      toast.error("Failed to save student")
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <button
          onClick={handleAddStudent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name, admission number, or class..."
            className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Student Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingStudent ? "Edit Student" : "Add New Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Email</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Phone</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingStudent ? "Update Student" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent/Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.parentName}</div>
                      <div className="text-sm text-gray-500">{student.parentEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageStudents
