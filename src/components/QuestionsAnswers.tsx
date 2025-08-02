import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { 
  MessageCircle, 
  Plus, 
  Upload, 
  Send,
  Image as ImageIcon,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Filter,
  Search,
  X,
  FileText,
  Eye,
  MessageSquare
} from 'lucide-react';

export const QuestionsAnswers: React.FC = () => {
  const { user } = useAuth();
  const { questions, addQuestion, addAnswer, getQuestionStats } = useApp();
  const [activeTab, setActiveTab] = useState<'browse' | 'submit' | 'answer'>('browse');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'technical' | 'general'>('all');

  // Filter questions based on search and category
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = getQuestionStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-sky-600" />
            <span>Questions & Answers</span>
          </h1>
          <p className="text-gray-600 mt-1">Ask questions and share knowledge with the community</p>
        </div>
        
        <button
          onClick={() => setShowSubmitModal(true)}
          className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Answers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnswers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Unanswered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unansweredQuestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">My Questions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.myQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="technical">Technical</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              onSelect={setSelectedQuestion}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">Be the first to ask a question!</p>
          </div>
        )}
      </div>

      {/* Submit Question Modal */}
      {showSubmitModal && (
        <SubmitQuestionModal onClose={() => setShowSubmitModal(false)} />
      )}

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <QuestionDetailModal 
          question={selectedQuestion} 
          onClose={() => setSelectedQuestion(null)} 
        />
      )}
    </div>
  );
};

const QuestionCard: React.FC<{ question: any; onSelect: (question: any) => void }> = ({ 
  question, 
  onSelect 
}) => {
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(question)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h3>
          <p className="text-gray-600 line-clamp-2">{question.content}</p>
          
          {question.image && (
            <div className="mt-3">
              <img 
                src={question.image} 
                alt="Question attachment" 
                className="w-32 h-24 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm rounded-full font-medium capitalize">
            {question.category}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{question.answers?.length || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{question.upvotes || 0}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>By {question.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{getTimeAgo(question.createdAt)}</span>
          </div>
        </div>
        
        {question.answers?.length === 0 && (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
            Unanswered
          </span>
        )}
      </div>
    </div>
  );
};

const SubmitQuestionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const { addQuestion } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'academic' | 'technical' | 'general'>('general');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    const questionData = {
      title,
      content,
      author: user.name,
      authorId: user.id,
      category,
      department: user.department,
      batch: user.batch,
      image: imagePreview,
      upvotes: 0,
      answers: [],
    };
    
    addQuestion(questionData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Ask a Question</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Question Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="What's your question?"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Question Details
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Provide more details about your question..."
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="image"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Choose Image</span>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {selectedImage && (
                <span className="text-sm text-gray-600">{selectedImage.name}</span>
              )}
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-48 h-36 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionDetailModal: React.FC<{ question: any; onClose: () => void }> = ({ 
  question, 
  onClose 
}) => {
  const { user } = useAuth();
  const { addAnswer } = useApp();
  const [answerContent, setAnswerContent] = useState('');
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [answerImagePreview, setAnswerImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnswerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setAnswerImage(file);
      const reader = new FileReader();
      reader.onload = () => setAnswerImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !answerContent.trim()) return;
    
    setLoading(true);
    
    const answerData = {
      questionId: question.id,
      content: answerContent,
      author: user.name,
      authorId: user.id,
      authorRole: user.role,
      image: answerImagePreview,
      upvotes: 0,
    };
    
    addAnswer(answerData);
    setAnswerContent('');
    setAnswerImage(null);
    setAnswerImagePreview('');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Question Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Question */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{question.title}</h3>
              <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm rounded-full font-medium capitalize">
                {question.category}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{question.content}</p>
            
            {question.image && (
              <img 
                src={question.image} 
                alt="Question attachment" 
                className="w-64 h-48 object-cover rounded-lg border border-gray-200 mb-4"
              />
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>By {question.author}</span>
                <span>{question.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{question.upvotes || 0}</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Answers */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Answers ({question.answers?.length || 0})
            </h4>
            
            {question.answers && question.answers.length > 0 ? (
              <div className="space-y-4">
                {question.answers.map((answer: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-sky-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{answer.author}</span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            answer.authorRole === 'teacher' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {answer.authorRole}
                          </span>
                          <span className="text-sm text-gray-500">
                            {answer.createdAt?.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{answer.content}</p>
                        
                        {answer.image && (
                          <img 
                            src={answer.image} 
                            alt="Answer attachment" 
                            className="w-48 h-36 object-cover rounded-lg border border-gray-200 mb-3"
                          />
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-sky-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{answer.upvotes || 0}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                            <Reply className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              </div>
            )}
          </div>
          
          {/* Submit Answer */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h4>
            
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Write your answer here..."
              />
              
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="answerImage"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Add Image</span>
                </label>
                <input
                  id="answerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleAnswerImageSelect}
                  className="hidden"
                />
                
                {answerImage && (
                  <span className="text-sm text-gray-600">{answerImage.name}</span>
                )}
              </div>
              
              {answerImagePreview && (
                <img 
                  src={answerImagePreview} 
                  alt="Answer preview" 
                  className="w-48 h-36 object-cover rounded-lg border border-gray-200"
                />
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !answerContent.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};