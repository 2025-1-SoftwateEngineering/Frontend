import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AllProgress, TestResult } from './types';

// ─── 일별 목표 데이터 ──────────────────────────────────────────────────────────
interface DailyData {
  date:          string;   // 'YYYY-MM-DD'
  learnedCount:  number;   // 오늘 새로 암기한 단어 수
  testedBookIds: number[]; // 오늘 테스트 완료한 bookId 목록
}

interface ProgressContextValue {
  progress:          AllProgress;
  markLearned:       (bookId: number, wordId: number) => void;
  addTestResult:     (bookId: number, result: TestResult, xpGain: number) => void;
  getBookProgress:   (bookId: number) => { learnedCount: number; lastScore: number | null };
  totalExp:          number;
  level:             number;
  /** 오늘 새로 암기한 단어 수 (자정마다 초기화) */
  dailyLearnedCount: number;
  /** 오늘 테스트 완료한 단어장 수 (자정마다 초기화) */
  dailyTestedCount:  number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STORAGE_KEY       = 'vocabuddy_progress';
const EXP_STORAGE_KEY   = 'vocabuddy_exp';
const DAILY_STORAGE_KEY = 'vocabuddy_daily';

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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

function loadDaily(): DailyData {
  try {
    const stored = localStorage.getItem(DAILY_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      if (data.date === todayStr()) return data;
    }
  } catch {}
  // 날짜가 바뀌었거나 데이터 없음 → 오늘 날짜로 초기화
  const fresh: DailyData = { date: todayStr(), learnedCount: 0, testedBookIds: [] };
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function calcLevel(exp: number) {
  return Math.floor(exp / 100) + 1;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<AllProgress>(loadProgress);
  const [totalExp, setTotalExp] = useState<number>(loadExp);
  const [daily,    setDaily]    = useState<DailyData>(loadDaily);

  const markLearned = useCallback((bookId: number, wordId: number) => {
    let isNew = false;
    setProgress((prev) => {
      const book = prev[bookId] ?? { learnedWordIds: [], testResults: [] };
      if (book.learnedWordIds.includes(wordId)) return prev; // 이미 암기한 단어 → 스킵
      isNew = true;
      const next = {
        ...prev,
        [bookId]: { ...book, learnedWordIds: [...book.learnedWordIds, wordId] },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    // 새로 암기한 단어만 일별 카운터 +1
    if (isNew) {
      setDaily((prev) => {
        const todayDate = todayStr();
        const base = prev.date === todayDate
          ? prev
          : { date: todayDate, learnedCount: 0, testedBookIds: [] };
        const next: DailyData = { ...base, learnedCount: base.learnedCount + 1 };
        localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
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
    // 오늘 처음 테스트한 bookId만 일별 카운터에 추가
    setDaily((prev) => {
      const todayDate = todayStr();
      const base = prev.date === todayDate
        ? prev
        : { date: todayDate, learnedCount: 0, testedBookIds: [] };
      if (base.testedBookIds.includes(bookId)) return base;
      const next: DailyData = { ...base, testedBookIds: [...base.testedBookIds, bookId] };
      localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(next));
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
      dailyLearnedCount: daily.learnedCount,
      dailyTestedCount:  daily.testedBookIds.length,
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
