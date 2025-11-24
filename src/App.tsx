import React, { useState, useCallback } from 'react';
import { generateBookOutline, generateChapterContent, generateBookCover, generateChapterIllustration } from './services/geminiService';
import { saveBook } from './services/storageService';
import { Book, Chapter, GenerationProgress, GenerationStatus } from './types';
import { InputForm } from './components/InputForm';
import { LoadingScreen } from './components/LoadingScreen';
import { BookViewer } from './components/BookViewer';
import { HistoryModal } from './components/HistoryModal';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [progress, setProgress] = useState<GenerationProgress>({
    status: GenerationStatus.IDLE,
    currentStep: 0,
    totalSteps: 0,
    message: '',
  });
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleGenerate = useCallback(async (topic: string) => {
    setStatus(GenerationStatus.GENERATING_OUTLINE);
    setError(null);
    setProgress({
      status: GenerationStatus.GENERATING_OUTLINE,
      currentStep: 1,
      totalSteps: 10, // Approximate steps: 1 Outline + 1 Cover + 4 * (1 Text + 1 Image)
      message: 'Consulting the muse...',
    });

    try {
      // Step 1: Generate Outline
      setProgress(p => ({ ...p, message: 'Structuring the narrative arc...' }));
      const outline = await generateBookOutline(topic);
      
      const emptyChapters: Chapter[] = outline.chapters.map((c, i) => ({
        id: `ch-${i}`,
        title: c.title,
        content: '',
      }));

      // Step 2: Generate Cover Art
      setProgress({
        status: GenerationStatus.GENERATING_OUTLINE,
        currentStep: 2,
        totalSteps: 10,
        message: 'Designing the book cover...',
      });
      const coverImage = await generateBookCover(outline.bookTitle, topic);

      // Step 3: Generate Content & Illustrations
      setStatus(GenerationStatus.GENERATING_CONTENT);
      const generatedChapters: Chapter[] = [];
      const totalChapters = emptyChapters.length;
      
      // We will generate them one by one to update progress bar accurately
      for (let i = 0; i < totalChapters; i++) {
        const ch = emptyChapters[i];
        
        // Text
        setProgress({
          status: GenerationStatus.GENERATING_CONTENT,
          currentStep: 2 + (i * 2) + 1,
          totalSteps: 2 + (totalChapters * 2),
          message: `Writing Chapter ${i + 1}: ${ch.title}...`,
        });
        const content = await generateChapterContent(outline.bookTitle, ch.title, i, topic);

        // Image
        setProgress({
          status: GenerationStatus.GENERATING_CONTENT,
          currentStep: 2 + (i * 2) + 2,
          totalSteps: 2 + (totalChapters * 2),
          message: `Illustrating Chapter ${i + 1}...`,
        });
        const illustration = await generateChapterIllustration(ch.title, topic);

        generatedChapters.push({ ...ch, content, illustration });
      }

      const fullBook: Book = {
        title: outline.bookTitle,
        topic,
        chapters: generatedChapters,
        coverImage,
        createdAt: new Date(),
      };

      // Save to IndexedDB
      await saveBook(fullBook);

      setBook(fullBook);
      setStatus(GenerationStatus.COMPLETED);
    } catch (err) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setError("We encountered a writer's block. Please try again.");
    }
  }, []);

  const reset = () => {
    setStatus(GenerationStatus.IDLE);
    setBook(null);
    setError(null);
  };

  const handleSelectHistory = (selectedBook: Book) => {
    setBook(selectedBook);
    setStatus(GenerationStatus.COMPLETED);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col items-center justify-center">
        
        {/* State: Idle / Form */}
        {status === GenerationStatus.IDLE && (
          <InputForm 
            onSubmit={handleGenerate} 
            onOpenHistory={() => setIsHistoryOpen(true)}
            isGenerating={false} 
          />
        )}

        {/* State: Loading */}
        {(status === GenerationStatus.GENERATING_OUTLINE || status === GenerationStatus.GENERATING_CONTENT) && (
          <LoadingScreen progress={progress} />
        )}

        {/* State: Error */}
        {status === GenerationStatus.ERROR && (
          <div className="text-center space-y-4 max-w-md animate-in fade-in zoom-in-95">
             <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                 <AlertCircle className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Generation Failed</h3>
             <p className="text-slate-600">{error}</p>
             <button 
                onClick={reset}
                className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
             >
                Try Again
             </button>
          </div>
        )}

        {/* State: Completed / Reader */}
        {status === GenerationStatus.COMPLETED && book && (
          <BookViewer book={book} onReset={reset} />
        )}

      </main>
      
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelectBook={handleSelectHistory} 
      />

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-slate-400 text-xs pointer-events-none">
        <p>&copy; {new Date().getFullYear()} AI Scribe.</p>
      </footer>
    </div>
  );
};

export default App;