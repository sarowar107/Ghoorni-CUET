import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  batch?: string;
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
  batch?: string;
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
}

interface AppContextType {
  notices: Notice[];
  files: FileItem[];
  events: CalendarEvent[];
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  addFile: (file: Omit<FileItem, 'id' | 'uploadedAt'>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteNotice: (id: string) => void;
  deleteFile: (id: string) => void;
  getStats: () => {
    totalUsers: number;
    activeUsers: number;
    runningEvents: number;
    upcomingExams: number;
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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedNotices = localStorage.getItem('cuet_notices');
    const storedFiles = localStorage.getItem('cuet_files');
    const storedEvents = localStorage.getItem('cuet_events');
    const storedQuestions = localStorage.getItem('cuet_questions');

    if (storedNotices) {
      const parsedNotices = JSON.parse(storedNotices).map((notice: any) => ({
        ...notice,
        createdAt: new Date(notice.createdAt),
        expiresAt: new Date(notice.expiresAt),
        eventDate: notice.eventDate ? new Date(notice.eventDate) : undefined,
      }));
      setNotices(parsedNotices);
    } else {
      // Initialize with demo notices
      const demoNotices: Notice[] = [
        {
          id: '1',
          title: 'Mid-term Examination Schedule Released',
          content: 'The mid-term examination schedule for all departments has been published. Students are advised to check their respective department notice boards for detailed timing and venue information. All exams will be conducted following COVID-19 safety protocols.',
          author: 'Dr. Ahmed Rahman',
          authorId: 'teacher1',
          department: 'Computer Science & Engineering',
          category: 'academic',
          priority: 'high',
          isPublic: true,
          createdAt: new Date(2025, 0, 10),
          expiresAt: new Date(2025, 0, 25),
          isActive: true,
          attachments: ['exam_schedule.pdf', 'covid_protocols.pdf'],
          eventDate: new Date(2025, 0, 22, 9, 0) // January 22, 2025 at 9:00 AM
        },
        {
          id: '2',
          title: 'Tech Fest 2025 - Call for Participation',
          content: 'CUET Tech Fest 2025 is approaching! We invite all students to participate in various competitions including programming contests, robotics, and innovation showcases. Registration deadline is January 30th.',
          author: 'Student Affairs Office',
          authorId: 'admin1',
          department: 'All Departments',
          category: 'event',
          priority: 'medium',
          isPublic: true,
          createdAt: new Date(2025, 0, 8),
          expiresAt: new Date(2025, 1, 15),
          isActive: true,
          attachments: ['techfest_brochure.pdf']
        },
        {
          id: '3',
          title: 'Library System Maintenance',
          content: 'The central library management system will undergo scheduled maintenance on January 20th from 2:00 AM to 6:00 AM. Online services will be temporarily unavailable during this period.',
          author: 'Library Administration',
          authorId: 'admin2',
          department: 'All Departments',
          category: 'announcement',
          priority: 'low',
          isPublic: true,
          createdAt: new Date(2025, 0, 15),
          expiresAt: new Date(2025, 0, 21),
          isActive: true
        },
        {
          id: '4',
          title: 'Emergency: Campus Water Supply Disruption',
          content: 'Due to emergency pipeline repairs, water supply will be disrupted in academic buildings from 10:00 AM to 4:00 PM today. Alternative arrangements have been made in the student cafeteria.',
          author: 'Campus Maintenance',
          authorId: 'admin3',
          department: 'All Departments',
          category: 'alert',
          priority: 'urgent',
          isPublic: true,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
          isActive: true
        },
        {
          id: '5',
          title: 'CSE Department Seminar Series',
          content: 'Join us for the weekly seminar series featuring industry experts and research presentations. This week: "AI in Healthcare" by Dr. Sarah Johnson from MIT. Venue: Seminar Hall A, Time: 3:00 PM.',
          author: 'CSE Department',
          authorId: 'teacher2',
          department: 'Computer Science & Engineering',
          batch: '2022',
          category: 'academic',
          priority: 'medium',
          isPublic: false,
          createdAt: new Date(2025, 0, 12),
          expiresAt: new Date(2025, 0, 18),
          isActive: true,
          eventDate: new Date(2025, 0, 16, 15, 0) // January 16, 2025 at 3:00 PM
        },
        {
          id: '6',
          title: 'Scholarship Application Deadline Extended',
          content: 'The deadline for merit-based scholarship applications has been extended to February 5th. Students with CGPA above 3.5 are encouraged to apply. Required documents: transcripts, recommendation letters, and personal statement.',
          author: 'Financial Aid Office',
          authorId: 'admin4',
          department: 'All Departments',
          category: 'announcement',
          priority: 'high',
          isPublic: true,
          createdAt: new Date(2025, 0, 5),
          expiresAt: new Date(2025, 1, 5),
          isActive: true,
          attachments: ['scholarship_form.pdf', 'requirements.pdf']
        },
        {
          id: '7',
          title: 'Career Fair 2025 Registration Open',
          content: 'Annual Career Fair will be held on March 15-16, 2025. Top companies including Google, Microsoft, and local tech giants will participate. Students can register online and submit their resumes.',
          author: 'Career Services',
          authorId: 'admin5',
          department: 'All Departments',
          category: 'event',
          priority: 'high',
          isPublic: true,
          createdAt: new Date(2025, 0, 1),
          expiresAt: new Date(2025, 2, 16),
          isActive: true,
          attachments: ['company_list.pdf', 'registration_guide.pdf'],
          eventDate: new Date(2025, 2, 15, 9, 0) // March 15, 2025 at 9:00 AM
        },
        {
          id: '8',
          title: 'Class Schedule Change - EEE Department',
          content: 'Due to faculty availability, the following classes have been rescheduled: Circuit Analysis (EEE 201) moved from Monday 9 AM to Tuesday 11 AM. Power Systems (EEE 301) moved from Wednesday 2 PM to Thursday 10 AM.',
          author: 'EEE Department Head',
          authorId: 'teacher3',
          department: 'Electrical & Electronic Engineering',
          category: 'academic',
          priority: 'medium',
          isPublic: false,
          createdAt: new Date(2025, 0, 14),
          expiresAt: new Date(2025, 0, 28),
          isActive: true
        }
      ];
      setNotices(demoNotices);
      localStorage.setItem('cuet_notices', JSON.stringify(demoNotices));
    }

    if (storedFiles) {
      const parsedFiles = JSON.parse(storedFiles).map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt),
      }));
      setFiles(parsedFiles);
    }

    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }));
      setEvents(parsedEvents);
    } else {
      // Initialize with some sample events
      const sampleEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Mid-term Exam',
          description: 'CSE Department Mid-term examinations',
          date: new Date(2025, 0, 25),
          type: 'exam',
        },
        {
          id: '2',
          title: 'Tech Fest',
          description: 'Annual technology festival',
          date: new Date(2025, 1, 15),
          type: 'event',
        },
      ];
      setEvents(sampleEvents);
      localStorage.setItem('cuet_events', JSON.stringify(sampleEvents));
    }

    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions).map((question: any) => ({
        ...question,
        createdAt: new Date(question.createdAt),
        answers: question.answers?.map((answer: any) => ({
          ...answer,
          createdAt: new Date(answer.createdAt),
        })) || [],
      }));
      setQuestions(parsedQuestions);
    } else {
      // Initialize with demo questions
      const demoQuestions: Question[] = [
        {
          id: '1',
          title: 'How to solve differential equations in MATLAB?',
          content: 'I am struggling with solving second-order differential equations using MATLAB. Can someone provide a step-by-step guide with examples?',
          author: 'John Doe',
          authorId: '1',
          department: 'Computer Science & Engineering',
          batch: '2022',
          category: 'technical',
          upvotes: 5,
          createdAt: new Date(2025, 0, 10),
          answers: [
            {
              id: '1',
              questionId: '1',
              content: 'You can use the ode45 function in MATLAB. Here\'s a basic example: [t,y] = ode45(@(t,y) [y(2); -y(1)], [0 10], [1; 0]). This solves y\'\' + y = 0 with initial conditions.',
              author: 'Dr. Ahmed Rahman',
              authorId: 'teacher1',
              authorRole: 'teacher',
              upvotes: 8,
              createdAt: new Date(2025, 0, 11),
            }
          ],
        },
        {
          id: '2',
          title: 'Best practices for database design?',
          content: 'What are the key principles I should follow when designing a relational database for a web application?',
          author: 'Jane Smith',
          authorId: '2',
          department: 'Computer Science & Engineering',
          batch: '2023',
          category: 'academic',
          upvotes: 3,
          createdAt: new Date(2025, 0, 12),
          answers: [],
        },
        {
          id: '3',
          title: 'How to prepare for technical interviews?',
          content: 'I have upcoming technical interviews for software engineering positions. What topics should I focus on and how should I practice?',
          author: 'Bob Wilson',
          authorId: '3',
          department: 'Computer Science & Engineering',
          batch: '2022',
          category: 'general',
          upvotes: 12,
          createdAt: new Date(2025, 0, 8),
          answers: [
            {
              id: '2',
              questionId: '3',
              content: 'Focus on data structures and algorithms. Practice coding problems on LeetCode and HackerRank. Also, review system design concepts for senior positions.',
              author: 'Alice Johnson',
              authorId: '5',
              authorRole: 'student',
              upvotes: 6,
              createdAt: new Date(2025, 0, 9),
            },
            {
              id: '3',
              questionId: '3',
              content: 'Don\'t forget to practice behavioral questions too. Use the STAR method (Situation, Task, Action, Result) to structure your answers.',
              author: 'Dr. Sarah Lee',
              authorId: 'teacher2',
              authorRole: 'teacher',
              upvotes: 4,
              createdAt: new Date(2025, 0, 10),
            }
          ],
        }
      ];
      setQuestions(demoQuestions);
      localStorage.setItem('cuet_questions', JSON.stringify(demoQuestions));
    }
  }, []);

  const addNotice = (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedNotices = [newNotice, ...notices];
    setNotices(updatedNotices);
    localStorage.setItem('cuet_notices', JSON.stringify(updatedNotices));
  };

  const addFile = (fileData: Omit<FileItem, 'id' | 'uploadedAt'>) => {
    const newFile: FileItem = {
      ...fileData,
      id: Date.now().toString(),
      uploadedAt: new Date(),
    };

    const updatedFiles = [newFile, ...files];
    setFiles(updatedFiles);
    localStorage.setItem('cuet_files', JSON.stringify(updatedFiles));
  };

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('cuet_events', JSON.stringify(updatedEvents));
  };

  const deleteNotice = (id: string) => {
    const updatedNotices = notices.filter(notice => notice.id !== id);
    setNotices(updatedNotices);
    localStorage.setItem('cuet_notices', JSON.stringify(updatedNotices));
  };

  const deleteFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('cuet_files', JSON.stringify(updatedFiles));
  };

  const addQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'answers'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      createdAt: new Date(),
      answers: [],
    };

    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    localStorage.setItem('cuet_questions', JSON.stringify(updatedQuestions));
  };

  const addAnswer = (answerData: Omit<Answer, 'id' | 'createdAt'>) => {
    const newAnswer: Answer = {
      ...answerData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedQuestions = questions.map(question => {
      if (question.id === answerData.questionId) {
        return {
          ...question,
          answers: [...question.answers, newAnswer],
        };
      }
      return question;
    });

    setQuestions(updatedQuestions);
    localStorage.setItem('cuet_questions', JSON.stringify(updatedQuestions));
  };

  const getStats = () => {
    const users = JSON.parse(localStorage.getItem('cuet_users') || '[]');
    const now = new Date();
    const activeNotices = notices.filter(notice => notice.expiresAt > now);
    const upcomingExams = events.filter(event => 
      event.type === 'exam' && event.date > now
    );

    return {
      totalUsers: users.length,
      activeUsers: users.length, // Simplified - in real app would track last login
      runningEvents: activeNotices.length,
      upcomingExams: upcomingExams.length,
    };
  };

  const getQuestionStats = () => {
    const currentUser = JSON.parse(localStorage.getItem('cuet_user') || '{}');
    const totalAnswers = questions.reduce((sum, question) => sum + question.answers.length, 0);
    const unansweredQuestions = questions.filter(question => question.answers.length === 0).length;
    const myQuestions = questions.filter(question => question.authorId === currentUser.id).length;

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