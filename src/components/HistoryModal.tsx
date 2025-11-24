import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { getRecentBooks, deleteBook } from '../services/storageService';
import { X, Clock, Trash2, ChevronRight, Calendar } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectBook }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoading(true);
    const recent = await getRecentBooks();
    setBooks(recent);
    setIsLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      await deleteBook(book.createdAt);
      loadHistory();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Recent Books</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="mb-2">No books found in history.</p>
              <p className="text-sm text-slate-400">Generate your first eBook to see it here!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {books.map((book) => (
                <div 
                  key={book.createdAt.toString()}
                  onClick={() => onSelectBook(book)}
                  className="group flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Thumbnail / Icon */}
                  <div className="w-16 h-20 bg-slate-100 rounded flex-shrink-0 overflow-hidden border border-slate-100 relative">
                     {book.coverImage ? (
                        <img src={book.coverImage} alt="Cover" className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <Clock className="w-6 h-6" />
                        </div>
                     )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate mb-1">
                      {book.topic}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(book.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleDelete(e, book)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 text-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
