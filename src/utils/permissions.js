// Define permission constants for the application
export const PERMISSIONS = {
  // Admin permissions
  MANAGE_TEACHERS: "manage_teachers",
  MANAGE_STUDENTS: "manage_students",
  MANAGE_CLASSES: "manage_classes",
  MANAGE_SUBJECTS: "manage_subjects",
  GENERATE_PARENT_CREDENTIALS: "generate_parent_credentials",
  GENERATE_REPORTS: "generate_reports",
  ASSIGN_TEACHERS: "assign_teachers",
  ASSIGN_STUDENTS: "assign_students",

  // Teacher permissions
  VIEW_ASSIGNED_CLASSES: "view_assigned_classes",
  VIEW_ASSIGNED_SUBJECTS: "view_assigned_subjects",
  RECORD_GRADES: "record_grades",
  RECORD_ATTENDANCE: "record_attendance",
  VIEW_STUDENT_PROFILES: "view_student_profiles",
  GENERATE_CLASS_REPORTS: "generate_class_reports",

  // Parent permissions
  VIEW_CHILD_GRADES: "view_child_grades",
  VIEW_CHILD_ATTENDANCE: "view_child_attendance",
  VIEW_CHILD_REPORTS: "view_child_reports",
}

// Map roles to their permissions
export const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.MANAGE_TEACHERS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.MANAGE_SUBJECTS,
    PERMISSIONS.GENERATE_PARENT_CREDENTIALS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.ASSIGN_TEACHERS,
    PERMISSIONS.ASSIGN_STUDENTS,
    PERMISSIONS.VIEW_STUDENT_PROFILES,
    // Admin has all permissions
    PERMISSIONS.VIEW_ASSIGNED_CLASSES,
    PERMISSIONS.VIEW_ASSIGNED_SUBJECTS,
    PERMISSIONS.RECORD_GRADES,
    PERMISSIONS.RECORD_ATTENDANCE,
    PERMISSIONS.GENERATE_CLASS_REPORTS,
    PERMISSIONS.VIEW_CHILD_GRADES,
    PERMISSIONS.VIEW_CHILD_ATTENDANCE,
    PERMISSIONS.VIEW_CHILD_REPORTS,
  ],

  teacher: [
    PERMISSIONS.VIEW_ASSIGNED_CLASSES,
    PERMISSIONS.VIEW_ASSIGNED_SUBJECTS,
    PERMISSIONS.RECORD_GRADES,
    PERMISSIONS.RECORD_ATTENDANCE,
    PERMISSIONS.VIEW_STUDENT_PROFILES,
    PERMISSIONS.GENERATE_CLASS_REPORTS,
  ],

  parent: [PERMISSIONS.VIEW_CHILD_GRADES, PERMISSIONS.VIEW_CHILD_ATTENDANCE, PERMISSIONS.VIEW_CHILD_REPORTS],
}

// Helper function to check if a user has a specific permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false

  const permissions = ROLE_PERMISSIONS[userRole]
  return permissions && permissions.includes(permission)
}
