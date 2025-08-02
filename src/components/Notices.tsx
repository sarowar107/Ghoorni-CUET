import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { 
  Bell, 
  Plus, 
  Filter, 
  Clock, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  Building,
  Trash2,
  X,
  AlertTriangle,
  Paperclip
} from 'lucide-react';

export const Notices: React.FC = () => {
  const { user } = useAuth();
  const { notices, addNotice, deleteNotice } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'event' | 'general' | 'announcement' | 'alert'>('all');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // Filter notices based on user permissions and filters
  const filteredNotices = notices.filter(notice => {
    const now = new Date();
    const isExpired = notice.expiresAt <= now;
    
    // Filter by expiration
    if (!showExpired && isExpired) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && notice.category !== categoryFilter) return false;
    
    // Filter by public only
    if (showPublicOnly && !notice.isPublic) return false;
    
    // Check user permissions to view notice
    if (notice.isPublic) return true;
    if (notice.department === user?.department) {
      if (!notice.batch || notice.batch === user?.batch) return true;
    }
    if (notice.authorId === user?.id) return true;
    
    return false;
  });

  const canCreateNotice = user?.role === 'cr' || user?.role === 'teacher' || user?.role === 'admin';
  
  const canDeleteNotice = (notice: any) => {
    return notice.authorId === user?.id || user?.role === 'admin';
  };

  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    return `${hours}h remaining`;
  };

  const isUrgent = (expiresAt: Date): boolean => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return diff > 0 && diff < 12 * 60 * 60 * 1000; // Less than 12 hours and not expired
  };

  const isExpired = (expiresAt: Date): boolean => {
    return expiresAt <= new Date();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Bell className="w-8 h-8 text-sky-600" />
            <span>Notices</span>
          </h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest announcements</p>
        </div>
        
        {canCreateNotice && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Notice</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <button
            onClick={() => setShowExpired(!showExpired)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showExpired 
                ? 'bg-sky-100 text-sky-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showExpired ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-sm">Show Expired</span>
          </button>
          
          <button
            onClick={() => setShowPublicOnly(!showPublicOnly)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showPublicOnly 
                ? 'bg-sky-100 text-sky-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="text-sm">Public Only</span>
          </button>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="event">Events</option>
            <option value="general">General</option>
            <option value="announcement">Announcements</option>
            <option value="alert">Alerts</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-200 ${
                isExpired(notice.expiresAt) ? 'border-gray-200 opacity-75' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                    {notice.priority === 'urgent' && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        <span>URGENT</span>
                      </div>
                    )}
                    {notice.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Public
                      </span>
                    )}
                    <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full font-medium capitalize">
                      {notice.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{notice.content}</p>
                  
                  {notice.eventDate && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Event Date: {notice.eventDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {notice.attachments.map((attachment, index) => (
                          <span key={index} className="text-sm text-sky-600 hover:text-sky-700 cursor-pointer underline">
                            {attachment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span 
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          isExpired(notice.expiresAt)
                            ? 'bg-gray-100 text-gray-600'
                            : isUrgent(notice.expiresAt)
                            ? 'bg-red-100 text-red-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {getTimeRemaining(notice.expiresAt)}
                      </span>
                    </div>
                  </div>
                  
                  {canDeleteNotice(notice) && (
                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>By {notice.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{notice.department}</span>
                    {notice.batch && <span>• Batch {notice.batch}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{notice.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
            <p className="text-gray-500">No notices match your current filters.</p>
          </div>
        )}
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && <CreateNoticeModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};

const CreateNoticeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const { addNotice } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'academic' | 'event' | 'general' | 'announcement' | 'alert'>('general');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [eventDate, setEventDate] = useState('');
  const [expiresIn, setExpiresIn] = useState('7'); // days
  const [isPublic, setIsPublic] = useState(false);
  const [targetBatch, setTargetBatch] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const canCreatePublic = user?.role === 'admin';
  const canSelectBatch = user?.role === 'teacher' || user?.role === 'admin';

  const batches = ['2020', '2021', '2022', '2023', '2024'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    
    const noticeData = {
      title,
      content,
      author: user.name,
      authorId: user.id,
      department: user.department,
      batch: canSelectBatch && targetBatch ? targetBatch : user.batch,
      category,
      priority,
      isPublic: canCreatePublic ? isPublic : false,
      expiresAt,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      isActive: true,
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    
    addNotice(noticeData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Notice</h2>
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
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter notice title"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter notice content"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="event">Event</option>
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="expires" className="block text-sm font-medium text-gray-700 mb-2">
                Expires In (Days)
              </label>
              <select
                id="expires"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">1 Week</option>
                <option value="14">2 Weeks</option>
                <option value="30">1 Month</option>
              </select>
            </div>
          </div>
          
          {canSelectBatch && (
            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
                Target Batch (Optional)
              </label>
              <select
                id="batch"
                value={targetBatch}
                onChange={(e) => setTargetBatch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    Batch {batch}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {canCreatePublic && (
            <div className="flex items-center">
              <input
                id="public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label htmlFor="public" className="ml-2 block text-sm text-gray-700">
                Make this notice public (visible to all users)
              </label>
            </div>
          )}
          
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
                  <Plus className="w-5 h-5" />
                  <span>Create Notice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};