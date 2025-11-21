import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, LogOut, User, Settings } from 'lucide-react';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isLanding ? 'bg-transparent' : 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-500 font-bold text-xl">
              <Code2 className="h-8 w-8" />
              <span>LeetClone</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/problems" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Problems
                </Link>
                {user && user.isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">
                    Welcome, <span className="font-semibold text-indigo-400">{user.username}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
