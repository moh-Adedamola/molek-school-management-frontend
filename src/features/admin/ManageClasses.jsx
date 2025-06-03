"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Plus, Edit, Trash, Users, BookOpen } from "lucide-react"

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
        toast.error("Failed to load classes data")
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
        // Mock API call - replace with actual API call in production
        await new Promise((resolve) => setTimeout(resolve, 500))

        setClasses(classes.filter((c) => c.id !== classId))
        toast.success("Class deleted successfully")
      } catch (error) {
        console.error("Error deleting class:", error)
        toast.error("Failed to delete class")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.level || !formData.arm) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // Mock API call - replace with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const className = `${formData.level} ${formData.arm}`

      if (editingClass) {
        // Update existing class
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
        toast.success("Class updated successfully")
      } else {
        // Add new class
        const newClass = {
          id: Date.now(), // Mock ID generation
          name: className,
          level: formData.level,
          arm: formData.arm,
          capacity: formData.capacity,
          studentCount: 0,
          classTeacher: formData.classTeacher,
        }
        setClasses([...classes, newClass])
        toast.success("Class added successfully")
      }

      setShowForm(false)
    } catch (error) {
      console.error("Error saving class:", error)
      toast.error("Failed to save class")
    }
  }

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
        <h1 className="text-2xl font-bold">Manage Classes</h1>
        <button
          onClick={handleAddClass}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Class
        </button>
      </div>

      {/* Class Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingClass ? "Edit Class" : "Add New Class"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arm <span className="text-red-500">*</span>
                </label>
                <select
                  name="arm"
                  value={formData.arm}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
                <select
                  name="classTeacher"
                  value={formData.classTeacher}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
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

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingClass ? "Update Class" : "Add Class"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{classItem.name}</h3>
              <div className="flex space-x-1">
                <button onClick={() => handleEditClass(classItem)} className="text-blue-600 hover:text-blue-900 p-1">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDeleteClass(classItem.id)} className="text-red-600 hover:text-red-900 p-1">
                  <Trash size={18} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center mb-2">
                <Users size={18} className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm font-medium">Students</div>
                  <div className="text-lg font-semibold">
                    {classItem.studentCount} / {classItem.capacity}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <BookOpen size={18} className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm font-medium">Class Teacher</div>
                  <div className="text-base">{classItem.classTeacher || "Not Assigned"}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                View Class Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageClasses
