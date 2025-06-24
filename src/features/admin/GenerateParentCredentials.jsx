"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Mail, Copy, Users, Shield, CheckCircle, Menu, X } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState('pending') // For mobile tab switching
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
      
      // Auto-switch to credentials tab on mobile after generation
      if (window.innerWidth < 1280) {
        setActiveTab('generated')
      }
    } catch (error) {
      console.error("Error generating credentials:", error)
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleCopyCredentials = (credentials) => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}\nStudent: ${credentials.studentName}`
    navigator.clipboard.writeText(text)
    
    // Show a brief feedback (you could enhance this with a toast notification)
    const button = document.activeElement
    if (button) {
      const originalText = button.textContent
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = originalText
      }, 1000)
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium text-sm sm:text-base">Loading students...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 px-2">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl mb-2 sm:mb-4">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Parent Account Management</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Generate secure login credentials for parents to access their children's academic information
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{filteredStudents.length}</p>
                <p className="text-slate-600 text-xs sm:text-sm">Pending Accounts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{generatedCredentials.length}</p>
                <p className="text-slate-600 text-xs sm:text-sm">Generated Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{generatedCredentials.length}</p>
                <p className="text-slate-600 text-xs sm:text-sm">Ready to Send</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by student name, parent name, or email..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Tab Navigation - Only visible on smaller screens */}
        <div className="xl:hidden">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-1">
            <div className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Pending ({filteredStudents.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('generated')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'generated'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Generated ({generatedCredentials.length})</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="xl:grid xl:grid-cols-2 xl:gap-8 space-y-6 xl:space-y-0">
          
          {/* Students without parent accounts */}
          <div className={`${activeTab !== 'pending' ? 'hidden xl:block' : 'block'} bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg overflow-hidden`}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Pending Parent Accounts
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">Students requiring parent login credentials</p>
            </div>

            <div className="p-4 sm:p-6">
              {filteredStudents.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                      <div className="space-y-3">
                        {/* Student Info - Stacked on mobile */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-xs sm:text-sm">
                              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{student.name}</h3>
                            <p className="text-slate-500 text-xs sm:text-sm">{student.class} • {student.admissionNumber}</p>
                          </div>
                        </div>
                        
                        {/* Parent Info */}
                        <div className="pl-11 sm:pl-13 space-y-1">
                          <p className="text-slate-700 font-medium text-sm sm:text-base truncate">{student.parentName}</p>
                          <p className="text-slate-500 text-xs sm:text-sm truncate">{student.parentEmail}</p>
                        </div>
                        
                        {/* Generate Button - Full width on mobile */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => handleGenerateCredentials(student)}
                            disabled={generatingFor === student.id}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm sm:text-base">No students found without parent accounts</p>
                </div>
              )}
            </div>
          </div>

          {/* Generated Credentials */}
          <div className={`${activeTab !== 'generated' ? 'hidden xl:block' : 'block'} bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg overflow-hidden`}>
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Generated Credentials
              </h2>
              <p className="text-green-100 text-xs sm:text-sm mt-1">Ready to distribute to parents</p>
            </div>

            <div className="p-4 sm:p-6">
              {generatedCredentials.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {generatedCredentials.map((cred, index) => (
                    <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                      <div className="space-y-3">
                        {/* Parent Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{cred.parentName}</h3>
                            <p className="text-slate-500 text-xs sm:text-sm truncate">Parent of {cred.studentName}</p>
                          </div>
                        </div>
                        
                        {/* Credentials - Responsive layout */}
                        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                            <span className="text-slate-600 text-xs sm:text-sm block sm:inline">Username:</span>
                            <span className="font-mono text-xs sm:text-sm bg-white px-2 py-1 rounded border block sm:inline break-all">{cred.username}</span>
                          </div>
                          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                            <span className="text-slate-600 text-xs sm:text-sm block sm:inline">Password:</span>
                            <span className="font-mono text-xs sm:text-sm bg-white px-2 py-1 rounded border block sm:inline">{cred.password}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-400">
                          Generated: {new Date(cred.dateGenerated).toLocaleString()}
                        </p>
                        
                        {/* Action Buttons - Stacked on mobile */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                          <button
                            onClick={() => handleCopyCredentials(cred)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </button>
                          <button
                            onClick={() => handleSendEmail(cred)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2.5 sm:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm sm:text-base">No credentials have been generated yet</p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">Generated credentials will appear here</p>
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