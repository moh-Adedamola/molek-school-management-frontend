"use client"

import { useState, useEffect } from "react"
import { Award, BookOpen, TrendingUp, User, Hash, GraduationCap, Trophy, Target, BarChart3, Star, ChevronDown, Calendar, Medal, Zap } from "lucide-react"

const StudentGrades = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const [selectedTerm, setSelectedTerm] = useState(1)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
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
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading academic records...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Unable to Load Data</h3>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Data Available</h3>
            <p className="text-slate-600">Student academic records are not available at this time.</p>
          </div>
        </div>
      </div>
    )
  }

  const termData = studentData.terms.find(term => term.term === selectedTerm)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Academic Performance
              </h1>
              <p className="text-slate-500 font-medium">Track academic progress and achievements</p>
            </div>
          </div>
        </div>

        <StudentProfileCard 
          name={studentData.name}
          className={studentData.class}
          admissionNumber={studentData.admissionNumber}
        />

        <AcademicDashboard 
          terms={studentData.terms}
          selectedTerm={selectedTerm}
          onTermChange={setSelectedTerm}
          termData={termData}
        />
      </div>
    </div>
  )
}

const StudentProfileCard = ({ name, className, admissionNumber }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{name}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-2 text-slate-600">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold">{className}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Hash className="w-5 h-5" />
              <span className="font-semibold">{admissionNumber}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg mb-2">
            <Star className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs font-medium text-slate-600">Honor Student</p>
        </div>
      </div>
    </div>
  </div>
)

const AcademicDashboard = ({ terms, selectedTerm, onTermChange, termData }) => (
  <div className="space-y-8">
    {/* Term Selector & Performance Overview */}
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold">Academic Overview</h3>
            <p className="text-purple-100 font-medium">Performance metrics and insights</p>
          </div>
          <TermSelectorModern 
            selectedTerm={selectedTerm}
            onTermChange={onTermChange}
          />
        </div>
      </div>

      {termData && (
        <div className="p-6">
          <PerformanceMetrics 
            average={termData.average}
            position={termData.position}
            classAverage={termData.classAverage}
            cumulative={termData.cumulative}
          />
        </div>
      )}
    </div>

    {/* Subjects Performance */}
    {termData && (
      <>
        <SubjectPerformanceChart subjects={termData.subjects} />
        <DetailedGradesTable subjects={termData.subjects} />
      </>
    )}
  </div>
)

const TermSelectorModern = ({ selectedTerm, onTermChange }) => (
  <div className="relative">
    <select
      value={selectedTerm}
      onChange={(e) => onTermChange(Number(e.target.value))}
      className="appearance-none bg-white/20 border border-white/30 rounded-xl px-4 py-3 pr-10 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer hover:bg-white/30 transition-all"
    >
      <option value={1} className="text-slate-800">First Term</option>
      <option value={2} className="text-slate-800">Second Term</option>
      <option value={3} className="text-slate-800">Third Term</option>
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
  </div>
)

const PerformanceMetrics = ({ average, position, classAverage, cumulative }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    <MetricCard 
      icon={<TrendingUp className="w-6 h-6" />}
      label="Term Average" 
      value={`${average}%`} 
      color="emerald"
      trend="up"
    />
    <MetricCard 
      icon={<Trophy className="w-6 h-6" />}
      label="Class Position" 
      value={position} 
      color="yellow"
      highlight={true}
    />
    <MetricCard 
      icon={<Target className="w-6 h-6" />}
      label="Class Average" 
      value={`${classAverage}%`} 
      color="blue"
    />
    {cumulative && (
      <MetricCard 
        icon={<Medal className="w-6 h-6" />}
        label="Cumulative Average" 
        value={`${cumulative.average}%`} 
        color="purple"
        trend="up"
      />
    )}
  </div>
)

const MetricCard = ({ icon, label, value, color, highlight = false, trend }) => {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    yellow: "from-yellow-500 to-yellow-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600"
  }

  return (
    <div className={`relative p-6 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${highlight ? 'ring-2 ring-white/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
        </div>
      )}
      {highlight && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <Zap className="w-3 h-3 text-yellow-600" />
        </div>
      )}
    </div>
  )
}

const SubjectPerformanceChart = ({ subjects }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <div className="flex items-center space-x-3 mb-8">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
        <BarChart3 className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Subject Performance Overview</h3>
    </div>
    
    <div className="space-y-4">
      {subjects.map((subject, index) => (
        <SubjectPerformanceBar key={index} subject={subject} />
      ))}
    </div>
  </div>
)

const SubjectPerformanceBar = ({ subject }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-slate-700">{subject.name}</span>
      <div className="flex items-center space-x-2">
        <GradeBadgeModern grade={subject.grade} />
        <span className="text-sm font-bold text-slate-600">{subject.total}%</span>
      </div>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-1000 ${
          subject.total >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
          subject.total >= 70 ? "bg-gradient-to-r from-blue-400 to-blue-500" :
          subject.total >= 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-500" :
          "bg-gradient-to-r from-red-400 to-red-500"
        }`}
        style={{ width: `${subject.total}%` }}
      />
    </div>
  </div>
)

const DetailedGradesTable = ({ subjects }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
    <div className="p-6 border-b border-slate-200">
      <h3 className="text-xl font-bold text-slate-800">Detailed Academic Record</h3>
      <p className="text-slate-500">Complete breakdown of academic performance</p>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Subject</th>
            <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">C.A. (30)</th>
            <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Exam (70)</th>
            <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Total (100)</th>
            <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Grade</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Remark</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subjects.map((subject, index) => (
            <SubjectRowModern key={index} subject={subject} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const SubjectRowModern = ({ subject }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-slate-800">{subject.name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <ScoreDisplay score={subject.ca} max={30} />
    </td>
    <td className="px-6 py-4 text-center">
      <ScoreDisplay score={subject.exam} max={70} />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="font-bold text-lg text-slate-800">{subject.total}</div>
    </td>
    <td className="px-6 py-4 text-center">
      <GradeBadgeModern grade={subject.grade} />
    </td>
    <td className="px-6 py-4">
      <RemarkBadge remark={subject.remark} />
    </td>
  </tr>
)

const ScoreDisplay = ({ score, max }) => (
  <div className="text-center">
    <div className="font-semibold text-slate-700">{score}</div>
    <div className="text-xs text-slate-400">/ {max}</div>
  </div>
)

const GradeBadgeModern = ({ grade }) => {
  const gradeConfig = {
    A: { color: "from-emerald-500 to-emerald-600", textColor: "text-white", icon: <Star className="w-3 h-3" /> },
    B: { color: "from-blue-500 to-blue-600", textColor: "text-white", icon: <Award className="w-3 h-3" /> },
    C: { color: "from-yellow-500 to-yellow-600", textColor: "text-white", icon: <Medal className="w-3 h-3" /> },
    D: { color: "from-orange-500 to-orange-600", textColor: "text-white", icon: <Trophy className="w-3 h-3" /> },
    F: { color: "from-red-500 to-red-600", textColor: "text-white", icon: <Target className="w-3 h-3" /> }
  }

  const config = gradeConfig[grade] || gradeConfig.F

  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r ${config.color} ${config.textColor} font-bold text-sm shadow-lg`}>
      {config.icon}
      <span>{grade}</span>
    </div>
  )
}

const RemarkBadge = ({ remark }) => {
  const remarkConfig = {
    "Excellent": { color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "Good": { color: "bg-blue-100 text-blue-700 border-blue-200" },
    "Average": { color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    "Poor": { color: "bg-red-100 text-red-700 border-red-200" }
  }

  const config = remarkConfig[remark] || remarkConfig["Average"]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {remark}
    </span>
  )
}

export default StudentGrades