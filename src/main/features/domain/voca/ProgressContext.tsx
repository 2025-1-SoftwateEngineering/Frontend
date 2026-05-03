import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AllProgress, TestResult } from './types';

interface ProgressContextValue {
  progress: AllProgress;
  markLearned: (bookId: number, wordId: number) => void;
  addTestResult: (bookId: number, result: TestResult, xpGain: number) => void;
  getBookProgress: (bookId: number) => { learnedCount: number; lastScore: number | null };
  totalExp: number;
  level: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STORAGE_KEY = 'vocabuddy_progress';
const EXP_STORAGE_KEY = 'vocabuddy_exp';

function loadProgress(): AllProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function loadExp(): number {
  try {
    return parseInt(localStorage.getItem(EXP_STORAGE_KEY) || '0', 10);
  } catch { return 0; }
}

function calcLevel(exp: number) {
  return Math.floor(exp / 100) + 1;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<AllProgress>(loadProgress);
  const [totalExp, setTotalExp] = useState<number>(loadExp);

  const markLearned = useCallback((bookId: number, wordId: number) => {
    setProgress((prev) => {
      const book = prev[bookId] ?? { learnedWordIds: [], testResults: [] };
      if (book.learnedWordIds.includes(wordId)) return prev;
      const next = {
        ...prev,
        [bookId]: { ...book, learnedWordIds: [...book.learnedWordIds, wordId] },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addTestResult = useCallback((bookId: number, result: TestResult, xpGain: number) => {
    setProgress((prev) => {
      const book = prev[bookId] ?? { learnedWordIds: [], testResults: [] };
      const next = {
        ...prev,
        [bookId]: { ...book, testResults: [...book.testResults, result] },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setTotalExp((prev) => {
      const next = prev + xpGain;
      localStorage.setItem(EXP_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const getBookProgress = useCallback((bookId: number) => {
    const book = progress[bookId];
    if (!book) return { learnedCount: 0, lastScore: null };
    const results = book.testResults;
    const lastScore = results.length > 0 ? results[results.length - 1].score : null;
    return { learnedCount: book.learnedWordIds.length, lastScore };
  }, [progress]);

  return (
    <ProgressContext.Provider value={{
      progress, markLearned, addTestResult, getBookProgress,
      totalExp, level: calcLevel(totalExp),
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}