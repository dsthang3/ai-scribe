import React from 'react';
import { GenerationProgress, GenerationStatus } from '../types';
import { PenTool, CheckCircle2, Loader2, Book } from 'lucide-react';

interface LoadingScreenProps {
  progress: GenerationProgress;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const percent = Math.min(100, Math.round((progress.currentStep / progress.totalSteps) * 100));

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      
      {/* Dynamic Icon */}
      <div className="mx-auto w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6 relative">
         {progress.status === GenerationStatus.GENERATING_OUTLINE && (
             <Book className="w-10 h-10 text-indigo-600 animate-pulse" />
         )}
         {progress.status === GenerationStatus.GENERATING_CONTENT && (
             <PenTool className="w-10 h-10 text-indigo-600 animate-bounce" />
         )}
         <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
         <div 
            className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
            style={{ animationDuration: '3s' }}
         ></div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {progress.status === GenerationStatus.GENERATING_OUTLINE ? 'Architecting your Book' : 'Writing Chapters'}
      </h2>
      <p className="text-slate-500 mb-8 h-6">
        {progress.message}
      </p>

      {/* Progress Bar */}
      <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
        <span>Start</span>
        <span>{percent}%</span>
        <span>Finish</span>
      </div>

      <div className="mt-8 space-y-3 text-left">
         <StepItem 
            active={progress.status === GenerationStatus.GENERATING_OUTLINE}
            completed={progress.currentStep > 1}
            label="Analyzing topic & creating outline"
         />
         <StepItem 
            active={progress.status === GenerationStatus.GENERATING_CONTENT}
            completed={false}
            label="Drafting chapters & formatting content"
         />
      </div>
    </div>
  );
};

const StepItem: React.FC<{ active: boolean; completed: boolean; label: string }> = ({ active, completed, label }) => (
    <div className={`flex items-center gap-3 ${active ? 'text-indigo-600' : completed ? 'text-green-600' : 'text-slate-300'}`}>
        {completed ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
        ) : active ? (
            <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
        ) : (
            <div className="w-5 h-5 rounded-full border-2 border-current shrink-0" />
        )}
        <span className={`font-medium ${completed || active ? 'text-slate-700' : ''}`}>{label}</span>
    </div>
);
