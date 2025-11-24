import React, { useState } from 'react';
import { Book } from '../types';
import { Download, ChevronLeft, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generatePDF } from '../utils/pdfGenerator';

interface BookViewerProps {
  book: Book;
  onReset: () => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({ book, onReset }) => {
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 border border-slate-200">
      
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
            title="Create New Book"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-800 text-lg leading-tight truncate max-w-xs md:max-w-md">
              {book.title}
            </h1>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AI Edition</span>
          </div>
        </div>
        
        <button 
          onClick={() => generatePDF(book)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar (TOC) - Hidden on mobile */}
        <div className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
          {/* Cover Preview in Sidebar */}
          {book.coverImage && (
            <div className="p-5 pb-0">
               <div className="aspect-[3/4] w-full bg-slate-200 rounded-md overflow-hidden shadow-sm mb-4">
                  <img src={book.coverImage} alt="Cover" className="w-full h-full object-cover" />
               </div>
            </div>
          )}

          <div className="p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Table of Contents</h3>
            <div className="space-y-1">
               {book.chapters.map((chapter, idx) => (
                 <button
                   key={chapter.id}
                   onClick={() => setActiveChapter(idx)}
                   className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                     activeChapter === idx 
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                   }`}
                 >
                   <span className="mr-2 opacity-50">{idx + 1}.</span>
                   {chapter.title}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Reader View */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4 md:p-8 lg:p-12 book-scroll relative">
            <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-100 min-h-full p-8 md:p-16 rounded-sm">
                
                {/* Chapter Illustration */}
                {book.chapters[activeChapter].illustration && (
                    <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                        <img 
                            src={book.chapters[activeChapter].illustration} 
                            alt={`Illustration for ${book.chapters[activeChapter].title}`}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                )}
                
                {/* Fallback decoration if no image */}
                {!book.chapters[activeChapter].illustration && (
                    <div className="flex justify-center mb-8 text-slate-300">
                        <Quote className="w-8 h-8 opacity-20" />
                    </div>
                )}

                <div className="mb-12 text-center border-b pb-8 border-slate-100">
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-2 block">
                        Chapter {activeChapter + 1}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                        {book.chapters[activeChapter].title}
                    </h2>
                </div>
                
                <div className="prose prose-lg prose-slate font-serif mx-auto text-justify leading-relaxed text-slate-700">
                    <ReactMarkdown>
                        {book.chapters[activeChapter].content}
                    </ReactMarkdown>
                </div>

                {/* Footer Navigation within Reader */}
                <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between text-sm font-sans text-slate-500">
                   <button 
                     disabled={activeChapter === 0}
                     onClick={() => setActiveChapter(c => c - 1)}
                     className="hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                   >
                     &larr; Previous Chapter
                   </button>
                   <button 
                     disabled={activeChapter === book.chapters.length - 1}
                     onClick={() => setActiveChapter(c => c + 1)}
                     className="hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                   >
                     Next Chapter &rarr;
                   </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};