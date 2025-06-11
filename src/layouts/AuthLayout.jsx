import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  if (isAuthenticated && user?.role) {
    const roleRoutes = {
      "admin": "/admin",
      "teacher": "/teacher",  
      "parent": "/parent"
    };

    const route = roleRoutes[user.role];
    if (route) return <Navigate to={route} replace />;
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Clean Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
          {/* Subtle Geometric Pattern */}
          <div className="absolute inset-0 opacity-40">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
          </div>
          
          {/* Subtle Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-20 blur-xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          {/* Minimal Status Bar */}
          <div className="absolute top-6 right-6 flex items-center space-x-3 text-slate-600 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Online</span>
            </div>
            <div className="text-slate-400">•</div>
            <div className="font-mono">{formatTime(currentTime)}</div>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            {/* Clean Logo Design */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-all duration-300 animate-float">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                {/* Subtle Glow */}
                <div className="absolute inset-0 w-20 h-20 bg-indigo-500 rounded-2xl blur-md opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Clean Typography */}
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2 animate-fade-in">
              MOLEK GROUP OF SCHOOLS
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-slate-300 via-indigo-400 to-slate-300 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 max-w-md mx-auto font-medium mb-1">
              School Management System
            </p>
            <p className="text-sm text-slate-500">
              {formatDate(currentTime)}
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            {/* Clean Card Design */}
            <div className="relative">
              {/* Subtle Card Shadow */}
              <div className="absolute inset-0 bg-white/50 rounded-2xl blur-sm"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-sm py-10 px-8 shadow-xl rounded-2xl border border-white/60 hover:bg-white/90 transition-all duration-300 hover:shadow-2xl">
                {/* Minimal Top Decoration */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-gradient-to-r from-slate-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <Outlet />
              </div>
            </div>

            {/* Clean Footer */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 mb-4">
                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                  Privacy Policy
                </a>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                  Terms of Service
                </a>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                  Support
                </a>
              </div>
              
              <div className="text-slate-400 text-xs space-y-1">
                <p>Empowering education through innovation</p>
                <p>© {new Date().getFullYear()} Molek Group of Schools. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};

export default AuthLayout;