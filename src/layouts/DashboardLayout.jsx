"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/slices/authSlice"
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Home,
  UserPlus,
  BookOpenCheck,
  ClipboardList,
} from "lucide-react"

const DashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const getNavLinks = () => {
    switch (role) {
      case "admin":
        return [
          { to: "/admin", label: "Dashboard", icon: <Home size={20} /> },
          { to: "/admin/teachers", label: "Manage Teachers", icon: <Users size={20} /> },
          { to: "/admin/students", label: "Manage Students", icon: <User size={20} /> },
          { to: "/admin/classes", label: "Manage Classes", icon: <BookOpen size={20} /> },
          { to: "/admin/subjects", label: "Manage Subjects", icon: <BookOpenCheck size={20} /> },
          { to: "/admin/parents", label: "Parent Credentials", icon: <UserPlus size={20} /> },
          { to: "/admin/reports", label: "Reports", icon: <FileText size={20} /> },
        ]
      case "teacher":
        return [
          { to: "/teacher", label: "Dashboard", icon: <Home size={20} /> },
          { to: "/teacher/grades", label: "Manage Grades", icon: <BookOpen size={20} /> },
          { to: "/teacher/attendance", label: "Attendance", icon: <Calendar size={20} /> },
          { to: "/teacher/reports", label: "Reports", icon: <FileText size={20} /> },
        ]
      case "parent":
        return [
          { to: "/parent", label: "Dashboard", icon: <Home size={20} /> },
          { to: "/parent/grades", label: "View Grades", icon: <BookOpen size={20} /> },
          { to: "/parent/attendance", label: "Attendance", icon: <ClipboardList size={20} /> },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - fixed position */}
      <header className="bg-blue-600 text-white shadow-md fixed w-full z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 md:hidden">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">School Management System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block">{user?.name || "User"}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              <LogOut size={16} />
              <span className="hidden md:inline-block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16"> {/* Add pt-16 to account for header height */}
        {/* Sidebar - fixed position but below header */}
        <aside
          className={`bg-white w-64 shadow-lg fixed top-16 bottom-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
        >
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content - with margin for sidebar and padding for header */}
        <main className="flex-1 md:ml-64 p-4 mt-16"> {/* Add mt-16 to account for header height */}
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout