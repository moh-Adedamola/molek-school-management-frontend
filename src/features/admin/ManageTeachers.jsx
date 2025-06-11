"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Plus, Edit, Trash, Search, Check, X, Users, Clock, Mail, Phone, BookOpen, GraduationCap } from "lucide-react"

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
      await new Promise((resolve) => setTimeout(resolve, 500))
      setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacher.id))
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

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingTeacher) {
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
        const newTeacher = {
          id: Date.now(),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading teachers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Teacher Management</h1>
            <p className="text-slate-600">Manage your school's teaching staff and applications</p>
          </div>
          <button
            onClick={handleAddTeacher}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Teacher
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Active Teachers</p>
                <p className="text-2xl font-bold text-slate-800">{activeTeachers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Applications</p>
                <p className="text-2xl font-bold text-slate-800">{pendingTeachers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search teachers by name, email, or subject..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Teacher Form */}
        {showForm && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden animate-in slide-in-from-top duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h2 className="text-xl font-semibold text-white">
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Users size={16} />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={16} />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <GraduationCap size={16} />
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} />
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-medium text-slate-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  {editingTeacher ? "Update Teacher" : "Add Teacher"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs and Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200/50">
            <button
              className={`px-6 py-4 text-sm font-medium transition-all duration-300 relative ${
                activeTab === "active" 
                  ? "text-blue-600 bg-blue-50/50" 
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Teachers ({filteredActiveTeachers.length})
              {activeTab === "active" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium transition-all duration-300 relative ${
                activeTab === "pending" 
                  ? "text-blue-600 bg-blue-50/50" 
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Approvals ({filteredPendingTeachers.length})
              {activeTab === "pending" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activeTab === "active" ? (
              <table className="min-w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Subjects
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Classes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {filteredActiveTeachers.length > 0 ? (
                    filteredActiveTeachers.map((teacher, index) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                              <span className="text-blue-700 font-semibold text-sm">
                                {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">{teacher.name}</div>
                              {(teacher.qualification || teacher.specialization) && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {teacher.qualification && teacher.qualification}
                                  {teacher.specialization && teacher.qualification && " • "}
                                  {teacher.specialization && teacher.specialization}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-800 flex items-center gap-2">
                              <Mail size={14} className="text-slate-400" />
                              {teacher.email}
                            </div>
                            {teacher.phone && (
                              <div className="text-sm text-slate-600 flex items-center gap-2">
                                <Phone size={14} className="text-slate-400" />
                                {teacher.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {teacher.subjects && teacher.subjects.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects.map((subject, idx) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500 italic">No subjects assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          {teacher.classes && teacher.classes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {teacher.classes.map((cls, idx) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                  {cls}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500 italic">No classes assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditTeacher(teacher)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit Teacher"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete Teacher"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Users className="h-12 w-12 text-slate-300" />
                          <p className="text-slate-500 font-medium">No teachers found</p>
                          <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {filteredPendingTeachers.length > 0 ? (
                    filteredPendingTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                              <span className="text-orange-700 font-semibold text-sm">
                                {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div className="font-semibold text-slate-800">{teacher.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-800 flex items-center gap-2">
                              <Mail size={14} className="text-slate-400" />
                              {teacher.email}
                            </div>
                            {teacher.phone && (
                              <div className="text-sm text-slate-600 flex items-center gap-2">
                                <Phone size={14} className="text-slate-400" />
                                {teacher.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-slate-800">{teacher.appliedDate}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveTeacher(teacher)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Approve Application"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectTeacher(teacher.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Reject Application"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Clock className="h-12 w-12 text-slate-300" />
                          <p className="text-slate-500 font-medium">No pending applications</p>
                          <p className="text-slate-400 text-sm">All applications have been processed</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageTeachers