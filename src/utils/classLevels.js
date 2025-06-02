// Class level definitions for MOLEK GROUP OF SCHOOLS

export const CLASS_LEVELS = [
  { id: "JSS1", name: "JSS 1", category: "Junior Secondary" },
  { id: "JSS2", name: "JSS 2", category: "Junior Secondary" },
  { id: "JSS3", name: "JSS 3", category: "Junior Secondary" },
  { id: "SS1", name: "SS 1", category: "Senior Secondary" },
  { id: "SS2", name: "SS 2", category: "Senior Secondary" },
  { id: "SS3", name: "SS 3", category: "Senior Secondary" },
]

export const CLASS_ARMS = ["A", "B", "C", "D", "E"]

/**
 * Generate full class name
 * @param {string} level - Class level (e.g., 'JSS1')
 * @param {string} arm - Class arm (e.g., 'A')
 * @returns {string} Full class name (e.g., 'JSS 1A')
 */
export const generateClassName = (level, arm) => {
  const levelObj = CLASS_LEVELS.find((l) => l.id === level)
  return levelObj ? `${levelObj.name}${arm}` : `${level}${arm}`
}

/**
 * Parse class name to get level and arm
 * @param {string} className - Full class name (e.g., 'JSS 1A')
 * @returns {Object} Object with level and arm
 */
export const parseClassName = (className) => {
  const match = className.match(/^(JSS|SS)\s*(\d)([A-E])$/)
  if (match) {
    return {
      level: `${match[1]}${match[2]}`,
      arm: match[3],
    }
  }
  return { level: "", arm: "" }
}

/**
 * Get all possible classes
 * @returns {Array} Array of all class combinations
 */
export const getAllClasses = () => {
  const classes = []
  CLASS_LEVELS.forEach((level) => {
    CLASS_ARMS.forEach((arm) => {
      classes.push({
        id: `${level.id}${arm}`,
        name: generateClassName(level.id, arm),
        level: level.id,
        arm: arm,
        category: level.category,
      })
    })
  })
  return classes
}

/**
 * Get classes by category
 * @param {string} category - Category ('Junior Secondary' or 'Senior Secondary')
 * @returns {Array} Array of classes in the category
 */
export const getClassesByCategory = (category) => {
  return getAllClasses().filter((cls) => cls.category === category)
}

/**
 * Check if a class is valid
 * @param {string} className - Class name to validate
 * @returns {boolean} True if valid
 */
export const isValidClass = (className) => {
  const parsed = parseClassName(className)
  return CLASS_LEVELS.some((l) => l.id === parsed.level) && CLASS_ARMS.includes(parsed.arm)
}
