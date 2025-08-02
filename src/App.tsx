import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Notices } from './components/Notices';
import { Files } from './components/Files';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { QuestionsAnswers } from './components/QuestionsAnswers';

// Initialize demo data
const initializeDemoData = () => {
  const existingUsers = localStorage.getItem('cuet_users');
  if (!existingUsers) {
    const demoUsers = [
      {
        id: '1',
        name: 'Sarowar Islam',
        email: 'student@cuet.ac.bd',
        password: 'password',
        role: 'student',
        department: 'Computer Science & Engineering',
        batch: '2022',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Sabiha Anan',
        email: 'teacher@cuet.ac.bd',
        password: 'password',
        role: 'teacher',
        department: 'Computer Science & Engineering',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Bob Wilson',
        email: 'cr@cuet.ac.bd',
        password: 'password',
        role: 'cr',
        department: 'Computer Science & Engineering',
        batch: '2022',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '4',
        name: 'Admin User',
        email: 'admin@cuet.ac.bd',
        password: 'password',
        role: 'admin',
        department: 'Administration',
        isActive: true,
        profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
      }
    ];
    localStorage.setItem('cuet_users', JSON.stringify(demoUsers));
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              <Route path="/register" element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="notices" element={<Notices />} />
                <Route path="files" element={<Files />} />
                <Route path="questions" element={<QuestionsAnswers />} />
                <Route path="profile" element={<Profile />} />
                <Route path="admin" element={<AdminPanel />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;