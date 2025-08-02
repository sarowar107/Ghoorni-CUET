import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'cr' | 'teacher' | 'admin';
  department: string;
  batch?: string;
  profilePicture?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: () => void;
  uploadProfilePicture: (file: File) => Promise<string>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'cr' | 'teacher';
  department: string;
  batch?: string;
  verificationCode?: string;
}

// Demo CR verification codes
const CR_VERIFICATION_CODES = [
  'CR2024001',
  'CR2024002', 
  'CR2024003',
  'CR2024004',
  'CR2024005'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('cuet_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would make API call
    const users = JSON.parse(localStorage.getItem('cuet_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = { ...foundUser };
      delete userSession.password;
      setUser(userSession);
      localStorage.setItem('cuet_user', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, this would make API call
    
    // Check CR verification code if registering as CR
    if (userData.role === 'cr') {
      if (!userData.verificationCode || !CR_VERIFICATION_CODES.includes(userData.verificationCode)) {
        return false; // Invalid verification code
      }
    }
    
    const users = JSON.parse(localStorage.getItem('cuet_users') || '[]');
    const existingUser = users.find((u: any) => u.email === userData.email);
    
    if (existingUser) {
      return false; // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      isVerified: userData.role === 'cr' ? true : false,
      profilePicture: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
    };

    users.push(newUser);
    localStorage.setItem('cuet_users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cuet_user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('cuet_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('cuet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('cuet_users', JSON.stringify(users));
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    const users = JSON.parse(localStorage.getItem('cuet_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1 && users[userIndex].password === currentPassword) {
      users[userIndex].password = newPassword;
      localStorage.setItem('cuet_users', JSON.stringify(users));
      return true;
    }
    return false;
  };

  const deleteAccount = () => {
    if (!user) return;
    
    const users = JSON.parse(localStorage.getItem('cuet_users') || '[]');
    const filteredUsers = users.filter((u: any) => u.id !== user.id);
    localStorage.setItem('cuet_users', JSON.stringify(filteredUsers));
    logout();
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    // Mock file upload - in real app, this would upload to server/cloud storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        if (user) {
          updateProfile({ profilePicture: imageUrl });
        }
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  };
  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    uploadProfilePicture,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};