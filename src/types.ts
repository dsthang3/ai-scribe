// This tells TypeScript that process.env.API_KEY exists, stopping errors.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export interface Chapter {
  id: string;
  title: string;
  content: string; // Markdown
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
