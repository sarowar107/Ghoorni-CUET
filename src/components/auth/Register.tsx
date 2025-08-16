import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, UserPlus, Eye, EyeOff } from 'lucide-react';

type AccountType = 'student' | 'cr' | 'teacher';

export const Register: React.FC = () => {
  const [accountType, setAccountType] = useState<AccountType>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Computer Science & Engineering',
    'Electrical & Electronic Engineering', 
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Materials & Metallurgical Engineering',
    'Industrial & Production Engineering',
    'Petroleum & Mining Engineering',
    'Naval Architecture & Marine Engineering',
    'Architecture',
  ];

  const batches = ['2020', '2021', '2022', '2023', '2024'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        name,
        email,
        password,
        role: accountType,
        department,
        ...(accountType !== 'teacher' && { batch }),
        ...(accountType === 'cr' && { verificationCode }),
      };

      const success = await register(userData);
      if (success) {
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        if (accountType === 'cr') {
          setError('Invalid verification code or email already exists');
        } else {
          setError('Email already exists or registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2 font-medium">Join the CUET Portal community</p>
          </div>

          {/* Account Type Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'student' as AccountType, label: 'Student' },
                { type: 'cr' as AccountType, label: 'CR' },
                { type: 'teacher' as AccountType, label: 'Teacher' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`
                    py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105
                    ${accountType === type
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-pulse">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl animate-pulse">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="your.email@cuet.ac.bd"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {accountType !== 'teacher' && (
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch
                </label>
                <select
                  id="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batchYear) => (
                    <option key={batchYear} value={batchYear}>
                      {batchYear}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {accountType === 'cr' && (
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  CR Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter CR verification code"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Contact your department head to get a CR verification code.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};