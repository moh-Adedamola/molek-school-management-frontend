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
  Bell,
  Settings,
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
          { to: "/admin/teachers", label: "Teachers", icon: <Users size={20} /> },
          { to: "/admin/students", label: "Students", icon: <User size={20} /> },
          { to: "/admin/classes", label: "Classes", icon: <BookOpen size={20} /> },
          { to: "/admin/subjects", label: "Subjects", icon: <BookOpenCheck size={20} /> },
          { to: "/admin/parents", label: "Parents", icon: <UserPlus size={20} /> },
          { to: "/admin/reports", label: "Reports", icon: <FileText size={20} /> },
        ]
      case "teacher":
        return [
          { to: "/teacher", label: "Dashboard", icon: <Home size={20} /> },
          { to: "/teacher/grades", label: "Grades", icon: <BookOpen size={20} /> },
          { to: "/teacher/attendance", label: "Attendance", icon: <Calendar size={20} /> },
          { to: "/teacher/reports", label: "Reports", icon: <FileText size={20} /> },
        ]
      case "parent":
        return [
          { to: "/parent", label: "Dashboard", icon: <Home size={20} /> },
          { to: "/parent/grades", label: "Grades", icon: <BookOpen size={20} /> },
          { to: "/parent/attendance", label: "Attendance", icon: <ClipboardList size={20} /> },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  const getRoleColor = () => {
    switch (role) {
      case "admin": return "from-indigo-600 to-purple-600"
      case "teacher": return "from-emerald-600 to-teal-600"
      case "parent": return "from-blue-600 to-cyan-600"
      default: return "from-gray-600 to-gray-800"
    }
  }

  const getRoleAccent = () => {
    switch (role) {
      case "admin": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "teacher": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "parent": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getHoverColor = () => {
    switch (role) {
      case "admin": return "hover:bg-indigo-50 hover:text-indigo-700 hover:border-l-indigo-500"
      case "teacher": return "hover:bg-emerald-50 hover:text-emerald-700 hover:border-l-emerald-500"
      case "parent": return "hover:bg-blue-50 hover:text-blue-700 hover:border-l-blue-500"
      default: return "hover:bg-gray-50 hover:text-gray-700 hover:border-l-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className={`bg-gradient-to-r ${getRoleColor()} backdrop-blur-sm shadow-lg fixed w-full z-30 border-b border-white/20`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BookOpen size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  School Portal
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200">
                <Bell size={18} />
              </button>
              <div className="hidden md:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user?.name || "User"}</p>
                  <p className="text-white/70 capitalize text-xs">{role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-red-500/90 px-4 py-2 rounded-xl transition-all duration-200 text-white border border-white/20 hover:border-red-400"
              >
                <LogOut size={16} />
                <span className="hidden md:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside
          className={`bg-white/80 backdrop-blur-xl w-72 shadow-xl fixed top-20 bottom-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-all duration-300 ease-out z-20 border-r border-gray-200/50`}
        >
          <div className="p-6">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleAccent()}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)} Panel
            </div>
          </div>
          
          <nav className="px-4 pb-6">
            <ul className="space-y-1">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 transition-all duration-200 border-l-4 border-transparent ${getHoverColor()}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </div>
                    <span className="font-medium text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <Settings size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Settings & Support</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-10 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-72 min-h-screen">
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout