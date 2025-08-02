import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Calendar } from './Calendar';
import { 
  Users, 
  Activity, 
  Calendar as CalendarIcon, 
  GraduationCap,
  Bell,
  Clock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getStats, notices } = useApp();
  const stats = getStats();

  // Get recent notices (last 5)
  const recentNotices = notices
    .filter(notice => {
      const now = new Date();
      return notice.expiresAt > now && (
        notice.isPublic || 
        notice.department === user?.department ||
        (notice.batch && notice.batch === user?.batch)
      );
    })
    .slice(0, 5);

  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  const isUrgent = (expiresAt: Date): boolean => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return diff < 12 * 60 * 60 * 1000; // Less than 12 hours
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-full">
            <img 
              src={user?.profilePicture || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
              alt={user?.name}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-sky-100 text-lg mt-1 capitalize">
              {user?.role} • {user?.department} {user?.batch && `• Batch ${user.batch}`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <Users className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Running Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.runningEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingExams}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Calendar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-sky-600" />
              <span>Academic Calendar</span>
            </h2>
          </div>
          <div className="p-6">
            <Calendar />
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <span>Recent Notices</span>
            </h2>
          </div>
          <div className="p-6">
            {recentNotices.length > 0 ? (
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{notice.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span 
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            isUrgent(notice.expiresAt) 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {getTimeRemaining(notice.expiresAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">By {notice.author}</span>
                      <span className="text-xs text-sky-600 font-medium capitalize">
                        {notice.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent notices</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};