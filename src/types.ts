// Declare process to prevent TypeScript errors in the browser environment
declare var process: {
  env: {
    API_KEY: string;
  };
};

export interface Chapter {
  id: string;
  title: string;
  content: string; // Markdown or text
  illustration?: string; // Base64 string
}

export interface Book {
  title: string;
  topic: string;
  chapters: Chapter[];
  coverImage?: string; // Base64 string
  createdAt: Date;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_OUTLINE = 'GENERATING_OUTLINE',
  GENERATING_CONTENT = 'GENERATING_CONTENT',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface GenerationProgress {
  status: GenerationStatus;
  currentStep: number;
  totalSteps: number;
  message: string;
}