/*
  # Initial Database Schema for CUET Portal

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
    - `notices` - Notice/announcement system
    - `files` - File management system
    - `events` - Calendar events
    - `questions` - Q&A system questions
    - `answers` - Q&A system answers
    - `departments` - Department reference data
    - `batches` - Batch reference data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles and departments
    - Secure file access and notice visibility

  3. Features
    - User role-based access control
    - Department and batch-based content filtering
    - File upload and sharing system
    - Notice management with expiration
    - Q&A system with voting
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'cr', 'teacher', 'admin')),
  department_id uuid REFERENCES departments(id),
  batch_id uuid REFERENCES batches(id),
  profile_picture text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  batch_id uuid REFERENCES batches(id),
  category text NOT NULL CHECK (category IN ('academic', 'event', 'general', 'announcement', 'alert')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_public boolean DEFAULT false,
  is_active boolean DEFAULT true,
  event_date timestamptz,
  expires_at timestamptz NOT NULL,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploader_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  batch_id uuid REFERENCES batches(id),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('exam', 'event', 'holiday', 'notice')),
  department_id uuid REFERENCES departments(id),
  batch_id uuid REFERENCES batches(id),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  batch_id uuid REFERENCES batches(id),
  category text NOT NULL CHECK (category IN ('academic', 'technical', 'general')),
  image_url text,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Policies for departments (public read)
CREATE POLICY "Departments are viewable by everyone"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

-- Policies for batches (public read)
CREATE POLICY "Batches are viewable by everyone"
  ON batches FOR SELECT
  TO authenticated
  USING (true);

-- Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for notices
CREATE POLICY "Users can view notices based on permissions"
  ON notices FOR SELECT
  TO authenticated
  USING (
    is_public = true OR
    department_id IN (
      SELECT department_id FROM profiles WHERE id = auth.uid()
    ) OR
    author_id = auth.uid()
  );

CREATE POLICY "CRs, teachers, and admins can create notices"
  ON notices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('cr', 'teacher', 'admin')
    )
  );

CREATE POLICY "Authors and admins can update notices"
  ON notices FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Authors and admins can delete notices"
  ON notices FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policies for files
CREATE POLICY "Users can view files based on permissions"
  ON files FOR SELECT
  TO authenticated
  USING (
    is_public = true OR
    department_id IN (
      SELECT department_id FROM profiles WHERE id = auth.uid()
    ) OR
    uploader_id = auth.uid()
  );

CREATE POLICY "CRs, teachers, and admins can upload files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('cr', 'teacher', 'admin')
    )
  );

CREATE POLICY "Uploaders and admins can delete files"
  ON files FOR DELETE
  TO authenticated
  USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policies for events
CREATE POLICY "Users can view events based on permissions"
  ON events FOR SELECT
  TO authenticated
  USING (
    is_public = true OR
    department_id IN (
      SELECT department_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "CRs, teachers, and admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('cr', 'teacher', 'admin')
    )
  );

-- Policies for questions
CREATE POLICY "Users can view all questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policies for answers
CREATE POLICY "Users can view all answers"
  ON answers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their answers"
  ON answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete answers"
  ON answers FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insert initial departments
INSERT INTO departments (name, code) VALUES
  ('Computer Science & Engineering', 'CSE'),
  ('Electrical & Electronic Engineering', 'EEE'),
  ('Mechanical Engineering', 'ME'),
  ('Civil Engineering', 'CE'),
  ('Chemical Engineering', 'ChE'),
  ('Materials & Metallurgical Engineering', 'MME'),
  ('Industrial & Production Engineering', 'IPE'),
  ('Petroleum & Mining Engineering', 'PME'),
  ('Naval Architecture & Marine Engineering', 'NAME'),
  ('Architecture', 'ARCH')
ON CONFLICT (name) DO NOTHING;

-- Insert initial batches
INSERT INTO batches (year) VALUES
  ('2020'),
  ('2021'),
  ('2022'),
  ('2023'),
  ('2024')
ON CONFLICT (year) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_batch_id ON profiles(batch_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_notices_department_id ON notices(department_id);
CREATE INDEX IF NOT EXISTS idx_notices_batch_id ON notices(batch_id);
CREATE INDEX IF NOT EXISTS idx_notices_expires_at ON notices(expires_at);
CREATE INDEX IF NOT EXISTS idx_notices_is_public ON notices(is_public);
CREATE INDEX IF NOT EXISTS idx_files_department_id ON files(department_id);
CREATE INDEX IF NOT EXISTS idx_files_batch_id ON files(batch_id);
CREATE INDEX IF NOT EXISTS idx_files_is_public ON files(is_public);
CREATE INDEX IF NOT EXISTS idx_questions_department_id ON questions(department_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();