"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Plus, Edit, Trash, Search, Check, X } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchTeachersData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        teachers: [
          {
            id: 1,
            name: "John Johnson",
            email: "john.johnson@school.com",
            phone: "123-456-7890",
            subjects: ["Mathematics", "Physics"],
            classes: ["JSS 1A", "JSS 2B"],
            status: "active",
          },
          {
            id: 2,
            name: "Mary Williams",
            email: "mary.williams@school.com",
            phone: "234-567-8901",
            subjects: ["English", "Literature"],
            classes: ["JSS 1A", "JSS 3A"],
            status: "active",
          },
          {
            id: 3,
            name: "Robert Brown",
            email: "robert.brown@school.com",
            phone: "345-678-9012",
            subjects: ["Chemistry", "Biology"],
            classes: ["JSS 2A", "JSS 3B"],
            status: "active",
          },
          {
            id: 4,
            name: "Sarah Davis",
            email: "sarah.davis@school.com",
            phone: "456-789-0123",
            subjects: ["Social Studies", "Civic Education"],
            classes: ["JSS 1B", "JSS 2A"],
            status: "active",
          },
          {
            id: 5,
            name: "Michael Wilson",
            email: "michael.wilson@school.com",
            phone: "567-890-1234",
            subjects: ["Computer Science"],
            classes: ["JSS 3A", "JSS 3B"],
            status: "active",
          },
        ],
        pendingTeachers: [
          {
            id: 6,
            name: "James Taylor",
            email: "james.taylor@school.com",
            phone: "678-901-2345",
            appliedDate: "2023-05-15",
            status: "pending",
          },
          {
            id: 7,
            name: "Jennifer Anderson",
            email: "jennifer.anderson@school.com",
            phone: "789-012-3456",
            appliedDate: "2023-05-16",
            status: "pending",
          },
        ],
      })
    }, 1000)
  })
}

const ManageTeachers = () => {
  const [activeTeachers, setActiveTeachers] = useState([])
  const [pendingTeachers, setPendingTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [activeTab, setActiveTab] = useState("active")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    specialization: "",
  })

  useEffect(() => {
    const loadTeachersData = async () => {
      try {
        const data = await fetchTeachersData()
        setActiveTeachers(data.teachers)
        setPendingTeachers(data.pendingTeachers)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading teachers data:", error)
        toast.error("Failed to load teachers data")
        setIsLoading(false)
      }
    }

    loadTeachersData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddTeacher = () => {
    setEditingTeacher(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      qualification: "",
      specialization: "",
    })
    setShowForm(true)
  }

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || "",
      address: teacher.address || "",
      qualification: teacher.qualification || "",
      specialization: teacher.specialization || "",
    })
    setShowForm(true)
  }

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        // Mock API call - replace with actual API call in production
        await new Promise((resolve) => setTimeout(resolve, 500))

        setActiveTeachers(activeTeachers.filter((teacher) => teacher.id !== teacherId))
        toast.success("Teacher deleted successfully")
      } catch (error) {
        console.error("Error deleting teacher:", error)
        toast.error("Failed to delete teacher")
      }
    }
  }

  const handleApproveTeacher = async (teacher) => {
    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from pending list
      setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacher.id))

      // Add to active teachers list
      const approvedTeacher = {
        ...teacher,
        status: "active",
        subjects: [],
        classes: [],
      }
      setActiveTeachers([...activeTeachers, approvedTeacher])

      toast.success(`${teacher.name} has been approved`)
    } catch (error) {
      console.error("Error approving teacher:", error)
      toast.error("Failed to approve teacher")
    }
  }

  const handleRejectTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to reject this teacher application?")) {
      try {
        // Mock API call - replace with actual API call in production
        await new Promise((resolve) => setTimeout(resolve, 500))

        setPendingTeachers(pendingTeachers.filter((teacher) => teacher.id !== teacherId))
        toast.success("Teacher application rejected")
      } catch (error) {
        console.error("Error rejecting teacher:", error)
        toast.error("Failed to reject teacher")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingTeacher) {
        // Update existing teacher
        const updatedTeachers = activeTeachers.map((teacher) => {
          if (teacher.id === editingTeacher.id) {
            return {
              ...teacher,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              qualification: formData.qualification,
              specialization: formData.specialization,
            }
          }
          return teacher
        })
        setActiveTeachers(updatedTeachers)
        toast.success("Teacher updated successfully")
      } else {
        // Add new teacher
        const newTeacher = {
          id: Date.now(), // Mock ID generation
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          qualification: formData.qualification,
          specialization: formData.specialization,
          subjects: [],
          classes: [],
          status: "active",
        }
        setActiveTeachers([...activeTeachers, newTeacher])
        toast.success("Teacher added successfully")
      }

      setShowForm(false)
    } catch (error) {
      console.error("Error saving teacher:", error)
      toast.error("Failed to save teacher")
    }
  }

  const filteredActiveTeachers = activeTeachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.subjects &&
        teacher.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  const filteredPendingTeachers = pendingTeachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <h1 className="text-2xl font-bold">Manage Teachers</h1>
        <button
          onClick={handleAddTeacher}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Teacher
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
            placeholder="Search teachers by name, email, or subject..."
            className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teacher Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h2>

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
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
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
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-t-lg shadow overflow-hidden mb-0">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "active" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Teachers ({filteredActiveTeachers.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Approvals ({filteredPendingTeachers.length})
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-b-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "active" ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActiveTeachers.length > 0 ? (
                  filteredActiveTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-xs text-gray-500">
                          {teacher.qualification && `${teacher.qualification}`}
                          {teacher.specialization && ` • ${teacher.specialization}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.email}</div>
                        <div className="text-sm text-gray-500">{teacher.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teacher.subjects && teacher.subjects.length > 0 ? (
                          <div className="text-sm text-gray-900">{teacher.subjects.join(", ")}</div>
                        ) : (
                          <div className="text-sm text-gray-500">No subjects assigned</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teacher.classes && teacher.classes.length > 0 ? (
                          <div className="text-sm text-gray-900">{teacher.classes.join(", ")}</div>
                        ) : (
                          <div className="text-sm text-gray-500">No classes assigned</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No teachers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPendingTeachers.length > 0 ? (
                  filteredPendingTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.email}</div>
                        <div className="text-sm text-gray-500">{teacher.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.appliedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleApproveTeacher(teacher)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleRejectTeacher(teacher.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No pending teacher approvals
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageTeachers
