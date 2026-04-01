export interface Word {
  id: number;
  word: string;
  meaning: string;
  example: string | null;
  vocaBookId: number;
}

export interface VocaBook {
  id: number;
  title: string;
  description: string;
  category: string;
  words: Word[];
  createdAt: string;
}

export interface TestResult {
  score: number;
  total: number;
  date: string;
}

export interface BookProgress {
  learnedWordIds: number[];
  testResults: TestResult[];
}

export type AllProgress = Record<number, BookProgress>;
