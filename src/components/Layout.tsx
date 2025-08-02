import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Bell, 
  Upload, 
  User, 
  Menu, 
  X, 
  LogOut,
  GraduationCap,
  Settings,
  ChevronDown,
  MessageCircle
} from 'lucide-react';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/notices', icon: Bell, label: 'Notices' },
    { path: '/files', icon: Upload, label: 'Files' },
    { path: '/questions', icon: MessageCircle, label: 'Q&A' },
    ...(user?.role === 'admin' ? [{ path: '/admin', icon: Settings, label: 'Admin Panel' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Top Navbar - Fixed */}
      <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Left side - Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-8 h-8 text-sky-600" />
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Ghoorni</h1>
              </div>
            </div>

            {/* Right side - User Profile and Logout */}
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img 
                    src={user?.profilePicture || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-sky-200"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Manage Profile</span>
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Fixed Sidebar - Full Height */}
      <div className={`
        fixed top-0 left-0 z-40 w-64 h-screen bg-gradient-to-b from-sky-600 to-blue-700 shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar Header Spacer */}
        <div className="h-16 flex items-center justify-center border-b border-sky-500 border-opacity-30">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-white" />
            <span className="text-white font-semibold">CUET Portal</span>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Main Navigation - Takes remaining space */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto" style={{ height: 'calc(100vh - 128px)' }}>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                        : 'text-sky-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Fixed Profile Section */}
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full
                ${location.pathname === '/profile'
                  ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                  : 'text-sky-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }
              `}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Manage Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content - Proper positioning with sidebar offset */}
      <div className="lg:ml-64">
        <div className="pt-16 min-h-screen">
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
};