import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  Plus,
  Filter,
  Building,
  Calendar,
  User,
  X,
  FileText,
  Image,
  Film,
  Archive
} from 'lucide-react';

export const Files: React.FC = () => {
  const { user } = useAuth();
  const { files, addFile, deleteFile } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // Filter files based on user permissions
  const filteredFiles = files.filter(file => {
    // Filter by public only
    if (showPublicOnly && !file.isPublic) return false;
    
    // Check user permissions to view file
    if (file.isPublic) return true;
    if (file.department === user?.department) {
      if (!file.batch || file.batch === user?.batch) return true;
    }
    if (file.uploaderId === user?.id) return true;
    
    return false;
  });

  const canUploadFiles = user?.role === 'cr' || user?.role === 'teacher' || user?.role === 'admin';
  
  const canDeleteFile = (file: any) => {
    return file.uploaderId === user?.id || user?.role === 'admin';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return FileText;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (file: any) => {
    // Mock download - in real app, this would download the actual file
    const link = document.createElement('a');
    link.href = file.url || '#';
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <File className="w-8 h-8 text-sky-600" />
            <span>File Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Share and access files within your department</p>
        </div>
        
        {canUploadFiles && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            <span>Upload File</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <button
            onClick={() => setShowPublicOnly(!showPublicOnly)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showPublicOnly 
                ? 'bg-sky-100 text-sky-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="text-sm">Public Files Only</span>
          </button>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type);
            
            return (
              <div
                key={file.id}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sky-100 rounded-lg">
                      <FileIcon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {file.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Public
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>By {file.uploadedBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{file.department}</span>
                    {file.batch && <span>• Batch {file.batch}</span>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{file.uploadedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex items-center space-x-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  
                  {canDeleteFile(file) && (
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-500">No files match your current filters.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
    </div>
  );
};

const UploadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const { addFile } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [targetBatch, setTargetBatch] = useState('');
  const [loading, setLoading] = useState(false);

  const canCreatePublic = user?.role === 'admin';
  const canSelectBatch = user?.role === 'teacher' || user?.role === 'admin';
  const batches = ['2020', '2021', '2022', '2023', '2024'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;
    
    setLoading(true);
    
    // Mock file upload - in real app, this would upload to server
    const fileUrl = URL.createObjectURL(selectedFile);
    
    const fileData = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      uploadedBy: user.name,
      uploaderId: user.id,
      department: user.department,
      batch: canSelectBatch && targetBatch ? targetBatch : user.batch,
      isPublic: canCreatePublic ? isPublic : false,
      url: fileUrl,
    };
    
    addFile(fileData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
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
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileSelect}
              required
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-400 focus:border-sky-500 transition-colors text-center"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
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
                Make this file public (accessible to all users)
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
              disabled={loading || !selectedFile}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};