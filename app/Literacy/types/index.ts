export interface Word {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  strokes: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface LearningProgress {
  userId: string;
  wordId: string;
  correctCount: number;
  totalAttempts: number;
  lastStudied: Date;
  masteryLevel: number; // 0-100
}

export interface PronunciationResult {
  accuracy: number; // 0-100
  feedback: string;
  audioUrl?: string;
}

export interface HandwritingResult {
  recognized: boolean;
  character?: string;
  confidence: number;
  feedback: string;
}

export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  voiceEnabled: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  dailyGoal: number;
}

export interface LessonData {
  id: string;
  title: string;
  words: Word[];
  difficulty: number;
  category: string;
}
