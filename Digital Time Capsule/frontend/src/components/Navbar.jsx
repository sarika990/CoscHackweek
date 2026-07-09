import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Hourglass, User as UserIcon, LogOut, LayoutDashboard, PlusCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const activeStyle = "text-primary-600 dark:text-primary-400 font-semibold";
  const inactiveStyle = "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors";

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-white shadow-md">
              <Hourglass className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 dark:from-white dark:via-primary-200 dark:to-indigo-200 bg-clip-text text-transparent">
              ChronosCapsule
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              Home
            </NavLink>
            <NavLink to="/public" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Public Feed</span>
              </span>
            </NavLink>

            {user ? (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/create" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                  Create Capsule
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                  Profile
                </NavLink>
              </>
            ) : null}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {user.profileImage ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${user.profileImage}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-primary-500"
                      onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'; }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl shadow-md shadow-primary-500/20 transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2"
          >
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-xl text-base font-medium ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/public"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-xl text-base font-medium ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Public Feed
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-3 py-2 rounded-xl text-base font-medium ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/create"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-3 py-2 rounded-xl text-base font-medium ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Create Capsule
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-3 py-2 rounded-xl text-base font-medium ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-base font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
