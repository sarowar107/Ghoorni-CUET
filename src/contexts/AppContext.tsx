import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, handleSupabaseError, getCurrentUserProfile } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  departmentId: string;
  batch?: string;
  batchId?: string;
  category: 'academic' | 'event' | 'general';
  isPublic: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  attachments?: string[];
  eventDate?: Date;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploaderId: string;
  department: string;
  departmentId: string;
  batch?: string;
  batchId?: string;
  isPublic: boolean;
  uploadedAt: Date;
  url: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'exam' | 'event' | 'holiday' | 'notice';
  departmentId?: string;
  batchId?: string;
  isPublic: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  departmentId: string;
  batch?: string;
  batchId?: string;
  category: 'academic' | 'technical' | 'general';
  image?: string;
  upvotes: number;
  createdAt: Date;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: string;
  image?: string;
  upvotes: number;
  createdAt: Date;
}

interface AppContextType {
  notices: Notice[];
  files: FileItem[];
  events: CalendarEvent[];
  questions: Question[];
  loading: boolean;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  addFile: (file: Omit<FileItem, 'id' | 'uploadedAt'>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'answers'>) => void;
  addAnswer: (answer: Omit<Answer, 'id' | 'createdAt'>) => void;
  deleteNotice: (id: string) => void;
  deleteFile: (id: string) => void;
  getStats: () => {
    totalUsers: number;
    activeUsers: number;
    runningEvents: number;
    upcomingExams: number;
  };
  getQuestionStats: () => {
    totalQuestions: number;
    totalAnswers: number;
    unansweredQuestions: number;
    myQuestions: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadNotices(),
        loadFiles(),
        loadEvents(),
        loadQuestions(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          *,
          profiles!notices_author_id_fkey(name),
          departments(name),
          batches(year)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError(error);
        return;
      }

      const formattedNotices: Notice[] = data.map((notice: any) => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        author: notice.profiles?.name || 'Unknown',
        authorId: notice.author_id,
        department: notice.departments?.name || 'All Departments',
        departmentId: notice.department_id,
        batch: notice.batches?.year,
        batchId: notice.batch_id,
        category: notice.category,
        priority: notice.priority,
        isPublic: notice.is_public,
        isActive: notice.is_active,
        createdAt: new Date(notice.created_at),
        expiresAt: new Date(notice.expires_at),
        eventDate: notice.event_date ? new Date(notice.event_date) : undefined,
        attachments: notice.attachments,
      }));

      setNotices(formattedNotices);
    } catch (error) {
      console.error('Error loading notices:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          profiles!files_uploader_id_fkey(name),
          departments(name),
          batches(year)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError(error);
        return;
      }

      const formattedFiles: FileItem[] = data.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.file_size,
        type: file.file_type,
        uploadedBy: file.profiles?.name || 'Unknown',
        uploaderId: file.uploader_id,
        department: file.departments?.name || 'All Departments',
        departmentId: file.department_id,
        batch: file.batches?.year,
        batchId: file.batch_id,
        isPublic: file.is_public,
        uploadedAt: new Date(file.created_at),
        url: file.file_path,
      }));

      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          departments(name),
          batches(year)
        `)
        .order('event_date', { ascending: true });

      if (error) {
        handleSupabaseError(error);
        return;
      }

      const formattedEvents: CalendarEvent[] = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: new Date(event.event_date),
        type: event.event_type,
        departmentId: event.department_id,
        batchId: event.batch_id,
        isPublic: event.is_public,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles!questions_author_id_fkey(name),
          departments(name),
          batches(year),
          answers(
            *,
            profiles!answers_author_id_fkey(name, role)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError(error);
        return;
      }

      const formattedQuestions: Question[] = data.map((question: any) => ({
        id: question.id,
        title: question.title,
        content: question.content,
        author: question.profiles?.name || 'Unknown',
        authorId: question.author_id,
        department: question.departments?.name || 'All Departments',
        departmentId: question.department_id,
        batch: question.batches?.year,
        batchId: question.batch_id,
        category: question.category,
        image: question.image_url,
        upvotes: question.upvotes,
        createdAt: new Date(question.created_at),
        answers: question.answers.map((answer: any) => ({
          id: answer.id,
          questionId: answer.question_id,
          content: answer.content,
          author: answer.profiles?.name || 'Unknown',
          authorId: answer.author_id,
          authorRole: answer.profiles?.role || 'student',
          image: answer.image_url,
          upvotes: answer.upvotes,
          createdAt: new Date(answer.created_at),
        })),
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const addNotice = async (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notices')
        .insert({
          title: noticeData.title,
          content: noticeData.content,
          author_id: user.id,
          department_id: noticeData.departmentId || user.departmentId,
          batch_id: noticeData.batchId || user.batchId,
          category: noticeData.category,
          priority: noticeData.priority,
          is_public: noticeData.isPublic,
          expires_at: noticeData.expiresAt.toISOString(),
          event_date: noticeData.eventDate?.toISOString(),
          attachments: noticeData.attachments,
        })
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadNotices(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  const addFile = async (fileData: Omit<FileItem, 'id' | 'uploadedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('files')
        .insert({
          name: fileData.name,
          file_path: fileData.url,
          file_size: fileData.size,
          file_type: fileData.type,
          uploader_id: user.id,
          department_id: fileData.departmentId || user.departmentId,
          batch_id: fileData.batchId || user.batchId,
          is_public: fileData.isPublic,
        })
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadFiles(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding file:', error);
    }
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          event_date: eventData.date.toISOString(),
          event_type: eventData.type,
          department_id: eventData.departmentId || user.departmentId,
          batch_id: eventData.batchId || user.batchId,
          is_public: eventData.isPublic,
        })
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadEvents(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const addQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'answers'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          title: questionData.title,
          content: questionData.content,
          author_id: user.id,
          department_id: questionData.departmentId || user.departmentId,
          batch_id: questionData.batchId || user.batchId,
          category: questionData.category,
          image_url: questionData.image,
        })
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadQuestions(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const addAnswer = async (answerData: Omit<Answer, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('answers')
        .insert({
          question_id: answerData.questionId,
          content: answerData.content,
          author_id: user.id,
          image_url: answerData.image,
        })
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadQuestions(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadNotices(); // Reload to get updated data
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) {
        handleSupabaseError(error);
        return;
      }

      await loadFiles(); // Reload to get updated data
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const getStats = () => {
    const now = new Date();
    const activeNotices = notices.filter(notice => notice.expiresAt > now);
    const upcomingExams = events.filter(event => 
      event.type === 'exam' && event.date > now
    );

    return {
      totalUsers: 0, // Would need to query profiles table
      activeUsers: 0, // Would need to track last login
      runningEvents: activeNotices.length,
      upcomingExams: upcomingExams.length,
    };
  };

  const getQuestionStats = () => {
    const totalAnswers = questions.reduce((sum, question) => sum + question.answers.length, 0);
    const unansweredQuestions = questions.filter(question => question.answers.length === 0).length;
    const myQuestions = questions.filter(question => question.authorId === user?.id).length;

    return {
      totalQuestions: questions.length,
      totalAnswers,
      unansweredQuestions,
      myQuestions,
    };
  };

  const value = {
    notices,
    files,
    events,
    questions,
    loading,
    addNotice,
    addFile,
    addEvent,
    addQuestion,
    addAnswer,
    deleteNotice,
    deleteFile,
    getStats,
    getQuestionStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};