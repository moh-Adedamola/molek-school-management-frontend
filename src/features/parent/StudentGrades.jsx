"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

const StudentGrades = () => {
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const [selectedTerm, setSelectedTerm] = useState(1)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        setStudentData({
          id: 1,
          name: "Tadese Maryam",
          class: "JSS2A",
          admissionNumber: "MOL123",
          terms: [
            {
              term: 1,
              subjects: [
                { name: "Mathematics", ca: 25, exam: 60, total: 85, grade: "A", remark: "Excellent" },
                { name: "English", ca: 22, exam: 55, total: 77, grade: "B", remark: "Good" },
                { name: "Science", ca: 20, exam: 50, total: 70, grade: "B", remark: "Good" },
                { name: "Social Studies", ca: 18, exam: 45, total: 63, grade: "C", remark: "Average" },
                { name: "Civic Education", ca: 24, exam: 58, total: 82, grade: "A", remark: "Excellent" },
              ],
              average: 75.4,
              position: "5th",
              classAverage: 68.2,
            },
            {
              term: 2,
              subjects: [
                { name: "Mathematics", ca: 27, exam: 62, total: 89, grade: "A", remark: "Excellent" },
                { name: "English", ca: 24, exam: 58, total: 82, grade: "A", remark: "Excellent" },
                { name: "Science", ca: 22, exam: 53, total: 75, grade: "B", remark: "Good" },
                { name: "Social Studies", ca: 20, exam: 50, total: 70, grade: "B", remark: "Good" },
                { name: "Civic Education", ca: 26, exam: 60, total: 86, grade: "A", remark: "Excellent" },
              ],
              average: 80.4,
              position: "3rd",
              classAverage: 70.5,
              cumulative: { average: 77.9 },
            },
            {
              term: 3,
              subjects: [
                { name: "Mathematics", ca: 28, exam: 65, total: 93, grade: "A", remark: "Excellent" },
                { name: "English", ca: 25, exam: 60, total: 85, grade: "A", remark: "Excellent" },
                { name: "Science", ca: 23, exam: 55, total: 78, grade: "B", remark: "Good" },
                { name: "Social Studies", ca: 21, exam: 52, total: 73, grade: "B", remark: "Good" },
                { name: "Civic Education", ca: 27, exam: 63, total: 90, grade: "A", remark: "Excellent" },
              ],
              average: 83.8,
              position: "2nd",
              classAverage: 72.1,
              cumulative: { average: 79.9 },
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching student data:", error)
        setError("Failed to load student data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p className="text-sm text-yellow-700">No student data available.</p>
      </div>
    )
  }

  const termData = studentData.terms.find(term => term.term === selectedTerm)

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Grades</h1>
        <p className="mt-2 text-sm text-gray-600">View your child's academic performance</p>
      </header>

      <StudentInfoCard 
        name={studentData.name}
        className={studentData.class}
        admissionNumber={studentData.admissionNumber}
      />

      <AcademicPerformance 
        terms={studentData.terms}
        selectedTerm={selectedTerm}
        onTermChange={setSelectedTerm}
      />
    </div>
  )
}

// Sub-components
const StudentInfoCard = ({ name, className, admissionNumber }) => (
  <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
    </div>
    <div className="border-t border-gray-200">
      <InfoRow label="Full name" value={name} />
      <InfoRow label="Class" value={className} bgGray />
      <InfoRow label="Admission Number" value={admissionNumber} />
    </div>
  </div>
)

const InfoRow = ({ label, value, bgGray = false }) => (
  <div className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${bgGray ? 'bg-gray-50' : 'bg-white'}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
)

const AcademicPerformance = ({ terms, selectedTerm, onTermChange }) => {
  const termData = terms.find(term => term.term === selectedTerm)

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900">Academic Performance</h3>
        <TermSelector 
          selectedTerm={selectedTerm}
          onTermChange={onTermChange}
        />
      </div>

      {termData && (
        <>
          <PerformanceStats 
            average={termData.average}
            position={termData.position}
            classAverage={termData.classAverage}
            cumulative={termData.cumulative}
          />
          
          <GradesTable subjects={termData.subjects} />
        </>
      )}
    </div>
  )
}

const TermSelector = ({ selectedTerm, onTermChange }) => (
  <select
    value={selectedTerm}
    onChange={(e) => onTermChange(Number(e.target.value))}
    className="block w-full sm:w-auto py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value={1}>First Term</option>
    <option value={2}>Second Term</option>
    <option value={3}>Third Term</option>
  </select>
)

const PerformanceStats = ({ average, position, classAverage, cumulative }) => (
  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Term Average" value={`${average}%`} />
      <StatCard label="Position in Class" value={position} />
      <StatCard label="Class Average" value={`${classAverage}%`} />
      {cumulative && (
        <StatCard label="Cumulative Average" value={`${cumulative.average}%`} />
      )}
    </div>
  </div>
)

const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
)

const GradesTable = ({ subjects }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>Subject</TableHeader>
          <TableHeader>C.A. (30)</TableHeader>
          <TableHeader>Exam (70)</TableHeader>
          <TableHeader>Total (100)</TableHeader>
          <TableHeader>Grade</TableHeader>
          <TableHeader>Remark</TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {subjects.map((subject, index) => (
          <SubjectRow key={index} subject={subject} />
        ))}
      </tbody>
    </table>
  </div>
)

const TableHeader = ({ children }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
)

const SubjectRow = ({ subject }) => (
  <tr>
    <TableCell className="font-medium">{subject.name}</TableCell>
    <TableCell>{subject.ca}</TableCell>
    <TableCell>{subject.exam}</TableCell>
    <TableCell>{subject.total}</TableCell>
    <TableCell>
      <GradeBadge grade={subject.grade} />
    </TableCell>
    <TableCell>{subject.remark}</TableCell>
  </tr>
)

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

const GradeBadge = ({ grade }) => {
  const colorClasses = {
    A: "bg-green-100 text-green-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-red-100 text-red-800"
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[grade]}`}>
      {grade}
    </span>
  )
}

export default StudentGrades