import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import teacherReducer from "./slices/teacherSlice"
import studentReducer from "./slices/studentSlice"
import classReducer from "./slices/classSlice"
import subjectReducer from "./slices/subjectSlice"
import attendanceReducer from "./slices/attendanceSlice"
import gradeReducer from "./slices/gradeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teachers: teacherReducer,
    students: studentReducer,
    classes: classReducer,
    subjects: subjectReducer,
    attendance: attendanceReducer,
    grades: gradeReducer,
  },
})
