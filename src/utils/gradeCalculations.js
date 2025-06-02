// Grade calculation utilities for MOLEK GROUP OF SCHOOLS

export const GRADE_BOUNDARIES = {
  "A+": 90,
  A: 80,
  "B+": 75,
  B: 70,
  "C+": 65,
  C: 60,
  "D+": 55,
  D: 50,
  E: 45,
  F: 0,
}

export const GRADE_POINTS = {
  "A+": 4.0,
  A: 3.5,
  "B+": 3.25,
  B: 3.0,
  "C+": 2.75,
  C: 2.5,
  "D+": 2.25,
  D: 2.0,
  E: 1.0,
  F: 0.0,
}

/**
 * Calculate grade letter from total score
 * @param {number} totalScore - Total score out of 100
 * @returns {string} Grade letter
 */
export const calculateGradeLetter = (totalScore) => {
  for (const [grade, boundary] of Object.entries(GRADE_BOUNDARIES)) {
    if (totalScore >= boundary) {
      return grade
    }
  }
  return "F"
}

/**
 * Calculate term total from CA and Exam scores
 * @param {number} caScore - Continuous Assessment score (max 30)
 * @param {number} examScore - Exam score (max 70)
 * @returns {number} Total score out of 100
 */
export const calculateTermTotal = (caScore = 0, examScore = 0) => {
  return Math.min(caScore, 30) + Math.min(examScore, 70)
}

/**
 * Calculate cumulative total for multiple terms
 * @param {Array} termScores - Array of term total scores
 * @returns {number} Cumulative total
 */
export const calculateCumulativeTotal = (termScores) => {
  return termScores.reduce((sum, score) => sum + (score || 0), 0)
}

/**
 * Calculate average from multiple terms
 * @param {Array} termScores - Array of term total scores
 * @returns {number} Average score
 */
export const calculateTermAverage = (termScores) => {
  const validScores = termScores.filter((score) => score !== null && score !== undefined)
  if (validScores.length === 0) return 0

  return Math.round((calculateCumulativeTotal(validScores) / validScores.length) * 100) / 100
}

/**
 * Get display fields based on current term
 * @param {number} currentTerm - Current term (1, 2, or 3)
 * @param {Object} gradeData - Grade data object with term scores
 * @returns {Object} Display data for the term
 */
export const getTermDisplayData = (currentTerm, gradeData) => {
  const { term1, term2, term3 } = gradeData

  const baseData = {
    term: currentTerm,
    ca: gradeData[`term${currentTerm}`]?.ca || 0,
    exam: gradeData[`term${currentTerm}`]?.exam || 0,
    total: gradeData[`term${currentTerm}`]?.total || 0,
  }

  switch (currentTerm) {
    case 1:
      return {
        ...baseData,
        showFields: ["ca", "exam", "total"],
      }

    case 2:
      const term1Total = term1?.total || 0
      const term2Total = term2?.total || 0
      const cumulative2 = term1Total + term2Total
      const average2 = cumulative2 / 2

      return {
        ...baseData,
        cumulative: cumulative2,
        average: Math.round(average2 * 100) / 100,
        showFields: ["ca", "exam", "total", "cumulative", "average"],
      }

    case 3:
      const term1Total3 = term1?.total || 0
      const term2Total3 = term2?.total || 0
      const term3Total3 = term3?.total || 0
      const cumulative3 = term1Total3 + term2Total3 + term3Total3
      const average3 = cumulative3 / 3

      return {
        ...baseData,
        cumulative: cumulative3,
        average: Math.round(average3 * 100) / 100,
        showFields: ["ca", "exam", "total", "cumulative", "average"],
      }

    default:
      return baseData
  }
}

/**
 * Validate grade input
 * @param {number} score - Score to validate
 * @param {string} type - Type of score ('ca' or 'exam')
 * @returns {Object} Validation result
 */
export const validateGradeInput = (score, type) => {
  const maxScores = { ca: 30, exam: 70 }
  const max = maxScores[type] || 100

  if (score < 0) {
    return { isValid: false, message: `Score cannot be negative` }
  }

  if (score > max) {
    return { isValid: false, message: `Score cannot exceed ${max}` }
  }

  return { isValid: true, message: "" }
}

/**
 * Calculate class position based on average scores
 * @param {Array} studentGrades - Array of student grade objects
 * @param {string} studentId - ID of student to find position for
 * @returns {number} Position in class
 */
export const calculateClassPosition = (studentGrades, studentId) => {
  const sortedGrades = studentGrades
    .map((student) => ({
      id: student.id,
      average: student.average || 0,
    }))
    .sort((a, b) => b.average - a.average)

  const position = sortedGrades.findIndex((student) => student.id === studentId) + 1
  return position || studentGrades.length
}

/**
 * Generate grade summary for a student
 * @param {Object} studentGrades - Student's grades across all subjects
 * @param {number} currentTerm - Current term
 * @returns {Object} Grade summary
 */
export const generateGradeSummary = (studentGrades, currentTerm) => {
  const subjects = Object.keys(studentGrades)
  const totalSubjects = subjects.length

  let totalMarks = 0
  let totalPossible = 0
  const gradeDistribution = {}

  subjects.forEach((subject) => {
    const termData = getTermDisplayData(currentTerm, studentGrades[subject])
    const grade = calculateGradeLetter(termData.total)

    totalMarks += termData.total
    totalPossible += 100

    gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1
  })

  const overallAverage = totalSubjects > 0 ? totalMarks / totalSubjects : 0
  const overallGrade = calculateGradeLetter(overallAverage)

  return {
    totalSubjects,
    overallAverage: Math.round(overallAverage * 100) / 100,
    overallGrade,
    totalMarks,
    totalPossible,
    gradeDistribution,
    percentage: totalPossible > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0,
  }
}
