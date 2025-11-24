import React, { useState } from 'react';
import { Sparkles, BookOpen, History } from 'lucide-react';

interface InputFormProps {
  onSubmit: (topic: string) => void;
  onOpenHistory: () => void;
  isGenerating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, onOpenHistory, isGenerating }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isGenerating) {
      onSubmit(topic);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-serif">
          Turn your ideas into <span className="text-indigo-600">eBooks</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-lg mx-auto">
          Enter a topic, and our AI will draft a complete, formatted eBook for you in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative flex bg-white rounded-lg shadow-xl p-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g., A beginner's guide to urban gardening..."
              className="flex-1 p-4 text-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Action Bar */}
      <div className="flex flex-col items-center gap-6">
        {/* Example chips */}
        <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
            <span>Try:</span>
            {['History of Coffee', 'Mindfulness for Busy Parents', 'Future of AI'].map((ex) => (
            <button
                key={ex}
                onClick={() => setTopic(ex)}
                disabled={isGenerating}
                className="hover:text-indigo-600 hover:underline disabled:no-underline disabled:opacity-50"
            >
                "{ex}"
            </button>
            ))}
        </div>

        {/* History Button */}
        <button 
            onClick={onOpenHistory}
            disabled={isGenerating}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
        >
            <History className="w-4 h-4" />
            <span>Recent Books</span>
        </button>
      </div>
    </div>
  );
};