import React from 'react';
import { GraduationCap } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-sky-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading CUET Portal</h2>
        <p className="text-gray-500">Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  );
};