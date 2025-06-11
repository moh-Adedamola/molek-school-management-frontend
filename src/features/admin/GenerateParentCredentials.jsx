"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Mail, Copy, Users, Shield, CheckCircle } from "lucide-react"

// Mock API call - replace with actual API call in production
const fetchStudentsWithoutParentAccounts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Tadese Maryam",
          admissionNumber: "STD2022001",
          class: "JSS 1A",
          parentName: "Mr and Mrs Tadese",
          parentEmail: "parent1@example.com",
          hasParentAccount: false,
        },
        {
          id: 2,
          name: "Adepoju Fareedah",
          admissionNumber: "STD2022002",
          class: "JSS 2B",
          parentName: "Mr and Mrs Adepoju",
          parentEmail: "parent2@example.com",
          hasParentAccount: false,
        },
        {
          id: 3,
          name: "Idris Sharif",
          admissionNumber: "STD2022003",
          class: "JSS 3A",
          parentName: "Mr and Mrs Idris",
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
  const [generatingFor, setGeneratingFor] = useState(null)

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudentsWithoutParentAccounts()
        setStudents(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading students:", error)
        setIsLoading(false)
      }
    }
    loadStudents()
  }, [])

  const handleGenerateCredentials = async (student) => {
    setGeneratingFor(student.id)
    try {
      const credentials = await generateParentCredentials(student.id, student.parentEmail)
      
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

      setStudents(students.map((s) => (s.id === student.id ? { ...s, hasParentAccount: true } : s)))
    } catch (error) {
      console.error("Error generating credentials:", error)
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleCopyCredentials = (credentials) => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}\nStudent: ${credentials.studentName}`
    navigator.clipboard.writeText(text)
  }

  const handleSendEmail = (credentials) => {
    // Mock email sending
    console.log(`Email would be sent to ${credentials.parentEmail}`)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading students...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Parent Account Management</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Generate secure login credentials for parents to access their children's academic information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{filteredStudents.length}</p>
                <p className="text-slate-600 text-sm">Pending Accounts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{generatedCredentials.length}</p>
                <p className="text-slate-600 text-sm">Generated Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{generatedCredentials.length}</p>
                <p className="text-slate-600 text-sm">Ready to Send</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name, parent name, or email..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Students without parent accounts */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Pending Parent Accounts
              </h2>
              <p className="text-blue-100 text-sm mt-1">Students requiring parent login credentials</p>
            </div>

            <div className="p-6">
              {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{student.name}</h3>
                              <p className="text-slate-500 text-sm">{student.class} • {student.admissionNumber}</p>
                            </div>
                          </div>
                          <div className="mt-3 pl-13">
                            <p className="text-slate-700 font-medium">{student.parentName}</p>
                            <p className="text-slate-500 text-sm">{student.parentEmail}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleGenerateCredentials(student)}
                          disabled={generatingFor === student.id}
                          className="ml-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {generatingFor === student.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <UserPlus className="w-4 h-4 mr-2" />
                          )}
                          {generatingFor === student.id ? 'Generating...' : 'Generate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No students found without parent accounts</p>
                </div>
              )}
            </div>
          </div>

          {/* Generated Credentials */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Generated Credentials
              </h2>
              <p className="text-green-100 text-sm mt-1">Ready to distribute to parents</p>
            </div>

            <div className="p-6">
              {generatedCredentials.length > 0 ? (
                <div className="space-y-4">
                  {generatedCredentials.map((cred, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{cred.parentName}</h3>
                              <p className="text-slate-500 text-sm">Parent of {cred.studentName}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 text-sm">Username:</span>
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded border">{cred.username}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 text-sm">Password:</span>
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded border">{cred.password}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            Generated: {new Date(cred.dateGenerated).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <button
                          onClick={() => handleCopyCredentials(cred)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </button>
                        <button
                          onClick={() => handleSendEmail(cred)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No credentials have been generated yet</p>
                  <p className="text-slate-400 text-sm mt-1">Generated credentials will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateParentCredentials