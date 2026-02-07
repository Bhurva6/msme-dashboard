import React from 'react';
import { Document } from '@/types';
import { FileText, Download, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface DocumentTileProps {
  document: Document;
  onDownload?: (document: Document) => void;
  onDelete?: (documentId: string) => void;
  loading?: boolean;
}

const DocumentTile: React.FC<DocumentTileProps> = ({
  document,
  onDownload,
  onDelete,
  loading = false,
}) => {
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (mimeType.startsWith('image/')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex-shrink-0">
          {getFileIcon(document.mime_type)}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {document.file_name}
          </h4>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span>{formatFileSize(document.file_size)}</span>
            <span>•</span>
            <span>{formatDate(document.created_at)}</span>
          </div>
          
          {/* Status Badge */}
          <div className="mt-2">
            {document.status === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                <Clock className="w-3 h-3" />
                Pending Review
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onDownload && (
            <button
              onClick={() => onDownload(document)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download"
              disabled={loading}
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(document.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTile;
