import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      departments(name, code),
      batches(year)
    `)
    .eq('id', user.id)
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  return profile;
};

// Helper function to check if user has permission
export const checkUserPermission = async (requiredRoles: string[]) => {
  const profile = await getCurrentUserProfile();
  return profile && requiredRoles.includes(profile.role);
};