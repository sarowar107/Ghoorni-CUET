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
import { LoadingSpinner } from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
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