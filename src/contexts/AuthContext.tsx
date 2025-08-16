import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'cr' | 'teacher' | 'admin';
  department: string;
  departmentId: string;
  batch?: string;
  batchId?: string;
  profilePicture?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          departments(id, name, code),
          batches(id, year)
        `)
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          name: profile.name,
          email: supabaseUser.email!,
          role: profile.role as User['role'],
          department: profile.departments?.name || '',
          departmentId: profile.department_id || '',
          batch: profile.batches?.year,
          batchId: profile.batch_id || undefined,
          profilePicture: profile.profile_picture || undefined,
          isVerified: profile.is_verified,
          isActive: profile.is_active,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Get department and batch IDs
      const { data: departments } = await supabase
        .from('departments')
        .select('id')
        .eq('name', userData.department)
        .single();

      let batchId = null;
      if (userData.batch) {
        const { data: batches } = await supabase
          .from('batches')
          .select('id')
          .eq('year', userData.batch)
          .single();
        batchId = batches?.id;
      }

      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return false;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: userData.name,
            role: userData.role,
            department_id: departments?.id,
            batch_id: batchId,
            is_verified: userData.role === 'cr',
            profile_picture: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          profile_picture: userData.profilePicture,
        })
        .eq('id', user.id);

      if (error) {
        handleSupabaseError(error);
        return;
      }

      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password change error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      // Delete profile (this will cascade delete related data)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        handleSupabaseError(profileError);
        return;
      }

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error('Auth deletion error:', authError);
      }

      await logout();
    } catch (error) {
      console.error('Account deletion error:', error);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user) throw new Error('No user logged in');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        handleSupabaseError(uploadError);
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      await updateProfile({ profilePicture: imageUrl });
      
      return imageUrl;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
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