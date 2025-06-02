import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Provider } from "react-redux"
import { store } from "./store"

// Layouts
import AuthLayout from "./layouts/AuthLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Auth Pages
import Login from "./features/auth/Login"
import Register from "./features/auth/Register"
import ForgotPassword from "./features/auth/ForgotPassword"

// Admin Pages
import AdminDashboard from "./features/dashboard/AdminDashboard"
import ManageTeachers from "./features/admin/ManageTeachers"
import ManageStudents from "./features/admin/ManageStudents"
import ManageClasses from "./features/admin/ManageClasses"
import ManageSubjects from "./features/admin/ManageSubjects"
import GenerateParentCredentials from "./features/admin/GenerateParentCredentials"
import AdminReports from "./features/admin/AdminReports"

// Teacher Pages
import TeacherDashboard from "./features/dashboard/TeacherDashboard"
import ClassGrades from "./features/teacher/ClassGrades"
import AttendanceRecords from "./features/teacher/AttendanceRecords"
import TeacherReports from "./features/teacher/TeacherReports"

// Parent Pages
import ParentDashboard from "./features/dashboard/ParentDashboard"
import StudentGrades from "./features/parent/StudentGrades"
import StudentAttendance from "./features/parent/StudentAttendance"

// Guards
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
    return (
        <Provider store={store}>
            <Router>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Routes>
                    {/* Auth Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRole="admin">
                                <DashboardLayout role="admin" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="teachers" element={<ManageTeachers />} />
                        <Route path="students" element={<ManageStudents />} />
                        <Route path="classes" element={<ManageClasses />} />
                        <Route path="subjects" element={<ManageSubjects />} />
                        <Route path="parents" element={<GenerateParentCredentials />} />
                        <Route path="reports" element={<AdminReports />} />
                    </Route>

                    {/* Teacher Routes */}
                    <Route
                        path="/teacher"
                        element={
                            <ProtectedRoute allowedRole="teacher">
                                <DashboardLayout role="teacher" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<TeacherDashboard />} />
                        <Route path="grades" element={<ClassGrades />} />
                        <Route path="attendance" element={<AttendanceRecords />} />
                        <Route path="reports" element={<TeacherReports />} />
                    </Route>

                    {/* Parent Routes */}
                    <Route
                        path="/parent"
                        element={
                            <ProtectedRoute allowedRole="parent">
                                <DashboardLayout role="parent" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<ParentDashboard />} />
                        <Route path="grades" element={<StudentGrades />} />
                        <Route path="attendance" element={<StudentAttendance />} />
                    </Route>

                    {/* Redirect to login for root path */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 redirect to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </Provider>
    )
}

export default App
