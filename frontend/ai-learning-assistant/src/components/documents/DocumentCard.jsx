import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

return (
  <div
    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 hover:shadow-md transition cursor-pointer relative group"
    onClick={handleNavigate}
  >
    {/* Header Section */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
        <FileText className="text-white" strokeWidth={2} />
      </div>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-500"
      >
        <Trash2 strokeWidth={2} />
      </button>
    </div>

    {/* Title */}
    <h3
      className="text-sm font-semibold text-slate-900 truncate mb-1"
      title={document.title}
    >
      {document.title}
    </h3>

    {/* Document Info */}
    <div className="mb-3">
      {document.fileSize !== undefined && (
        <span className="text-xs text-slate-500">
          {formatFileSize(document.fileSize)}
        </span>
      )}
    </div>

    {/* Stats Section */}
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {document.flashcardCount !== undefined && (
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-600">
          <BookOpen strokeWidth={2} className="w-3.5 h-3.5" />
          <span>{document.flashcardCount} Flashcards</span>
        </div>
      )}

      {document.quizCount !== undefined && (
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
          <BrainCircuit strokeWidth={2} className="w-3.5 h-3.5" />
          <span>{document.quizCount} Quizzes</span>
        </div>
      )}
    </div>

    {/* Footer Section */}
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <Clock strokeWidth={2} className="w-3.5 h-3.5" />
      <span>Uploaded {moment(document.createdAt).fromNow()}</span>
    </div>

    {/* Hover Indicator */}
    <div className="absolute inset-0 rounded-2xl border border-emerald-400 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
  </div>
);
};

export default DocumentCard;