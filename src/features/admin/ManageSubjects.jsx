"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Plus, Edit, Trash, Search, Users } from "lucide-react"

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
        toast.error("Failed to load subjects data")
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
      // Handle multiple select
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
        // Mock API call - replace with actual API call in production
        await new Promise((resolve) => setTimeout(resolve, 500))

        setSubjects(subjects.filter((s) => s.id !== subjectId))
        toast.success("Subject deleted successfully")
      } catch (error) {
        console.error("Error deleting subject:", error)
        toast.error("Failed to delete subject")
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

    // Basic validation
    if (!formData.name || !formData.code) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingSubject) {
        // Update existing subject
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
        toast.success("Subject updated successfully")
      } else {
        // Add new subject
        const newSubject = {
          id: Date.now(), // Mock ID generation
          name: formData.name,
          code: formData.code,
          description: formData.description,
          assignedTeachers: [],
          assignedClasses: [],
        }
        setSubjects([...subjects, newSubject])
        toast.success("Subject added successfully")
      }

      setShowForm(false)
    } catch (error) {
      console.error("Error saving subject:", error)
      toast.error("Failed to save subject")
    }
  }

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault()

    if (!assignmentData.teacherId) {
      toast.error("Please select a teacher")
      return
    }

    if (assignmentData.classIds.length === 0) {
      toast.error("Please select at least one class")
      return
    }

    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedTeacher = teachers.find((t) => t.id.toString() === assignmentData.teacherId)

      // Update subject with new assignment
      const updatedSubjects = subjects.map((s) => {
        if (s.id === currentSubject.id) {
          // Add teacher if not already assigned
          const updatedTeachers = [...s.assignedTeachers]
          if (!updatedTeachers.includes(selectedTeacher.name)) {
            updatedTeachers.push(selectedTeacher.name)
          }

          // Add classes if not already assigned
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
      toast.success("Teacher assigned successfully")
      setShowAssignmentModal(false)
    } catch (error) {
      console.error("Error assigning teacher:", error)
      toast.error("Failed to assign teacher")
    }
  }

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h1 className="text-2xl font-bold">Manage Subjects</h1>
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Subject
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
            placeholder="Search subjects by name or code..."
            className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Subject Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingSubject ? "Edit Subject" : "Add New Subject"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name <span className="text-red-500">*</span>
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
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
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
                {editingSubject ? "Update Subject" : "Add Subject"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subjects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Teachers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      <div className="text-xs text-gray-500">{subject.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subject.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subject.assignedTeachers.length > 0 ? (
                        <div className="text-sm text-gray-900">{subject.assignedTeachers.join(", ")}</div>
                      ) : (
                        <div className="text-sm text-gray-500">No teachers assigned</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subject.assignedClasses.length > 0 ? (
                        <div className="text-sm text-gray-900">{subject.assignedClasses.join(", ")}</div>
                      ) : (
                        <div className="text-sm text-gray-500">No classes assigned</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenAssignmentModal(subject)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Assign Teacher"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() => handleEditSubject(subject)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit Subject"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Subject"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && currentSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold">Assign Teacher to {currentSubject.name}</h2>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Teacher <span className="text-red-500">*</span>
                </label>
                <select
                  name="teacherId"
                  value={assignmentData.teacherId}
                  onChange={handleAssignmentChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Classes <span className="text-red-500">*</span>
                </label>
                <select
                  name="classIds"
                  multiple
                  value={assignmentData.classIds}
                  onChange={handleAssignmentChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-32"
                  required
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple classes</p>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Assign Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSubjects
