"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Search, UserPlus, Mail, Copy } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchStudentsWithoutParentAccounts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "John Doe",
          admissionNumber: "STD2022001",
          class: "JSS 1A",
          parentName: "Mr. Doe",
          parentEmail: "parent1@example.com",
          hasParentAccount: false,
        },
        {
          id: 2,
          name: "Jane Smith",
          admissionNumber: "STD2022002",
          class: "JSS 2B",
          parentName: "Mrs. Smith",
          parentEmail: "parent2@example.com",
          hasParentAccount: false,
        },
        {
          id: 3,
          name: "Michael Johnson",
          admissionNumber: "STD2022003",
          class: "JSS 3A",
          parentName: "Mr. Johnson",
          parentEmail: "parent3@example.com",
          hasParentAccount: false,
        },
      ])
    }, 1000)
  })
}

const generateParentCredentials = (studentId, parentEmail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random password
      const password = Math.random().toString(36).slice(-8)

      resolve({
        username: parentEmail,
        password: password,
        studentId: studentId,
      })
    }, 1000)
  })
}

const GenerateParentCredentials = () => {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [generatedCredentials, setGeneratedCredentials] = useState([])

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudentsWithoutParentAccounts()
        setStudents(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading students:", error)
        toast.error("Failed to load students")
        setIsLoading(false)
      }
    }

    loadStudents()
  }, [])

  const handleGenerateCredentials = async (student) => {
    try {
      const credentials = await generateParentCredentials(student.id, student.parentEmail)

      // Add to generated credentials list
      setGeneratedCredentials([
        ...generatedCredentials,
        {
          studentName: student.name,
          studentId: student.id,
          parentName: student.parentName,
          parentEmail: student.parentEmail,
          username: credentials.username,
          password: credentials.password,
          dateGenerated: new Date().toISOString(),
        },
      ])

      // Update student list to mark this student as having parent account
      setStudents(students.map((s) => (s.id === student.id ? { ...s, hasParentAccount: true } : s)))

      toast.success(`Credentials generated for ${student.parentName}`)
    } catch (error) {
      console.error("Error generating credentials:", error)
      toast.error("Failed to generate credentials")
    }
  }

  const handleCopyCredentials = (credentials) => {
    const text = `
      Username: ${credentials.username}
      Password: ${credentials.password}
      Student: ${credentials.studentName}
    `
    navigator.clipboard.writeText(text)
    toast.success("Credentials copied to clipboard")
  }

  const handleSendEmail = (credentials) => {
    // In a real application, this would send an email with the credentials
    toast.info(`Email would be sent to ${credentials.parentEmail} with login credentials`)
  }

  const filteredStudents = students.filter(
    (student) =>
      !student.hasParentAccount &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())),
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
      <h1 className="text-2xl font-bold mb-6">Generate Parent Credentials</h1>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by student name, parent name, or email..."
            className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students without parent accounts */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold">Students Without Parent Accounts</h2>
          </div>

          <div className="overflow-x-auto">
            {filteredStudents.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.parentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.parentEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleGenerateCredentials(student)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                        >
                          <UserPlus size={16} className="mr-1" />
                          Generate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">No students found without parent accounts</div>
            )}
          </div>
        </div>

        {/* Generated Credentials */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-100">
            <h2 className="text-lg font-semibold">Generated Credentials</h2>
          </div>

          <div className="overflow-x-auto">
            {generatedCredentials.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credentials
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedCredentials.map((cred, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cred.parentName}</div>
                        <div className="text-sm text-gray-500">{cred.parentEmail}</div>
                        <div className="text-xs text-gray-500">For: {cred.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <span className="font-medium">Username:</span> {cred.username}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Password:</span> {cred.password}
                        </div>
                        <div className="text-xs text-gray-500">
                          Generated: {new Date(cred.dateGenerated).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleCopyCredentials(cred)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                        >
                          <Copy size={14} className="mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() => handleSendEmail(cred)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Mail size={14} className="mr-1" />
                          Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">No credentials have been generated yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateParentCredentials
