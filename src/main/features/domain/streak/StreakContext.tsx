import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'scoi_streak';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  streakShield: boolean;
  studyHistory: string[];
}

export interface StreakResult {
  currentStreak: number;
  isNewRecord: boolean;
  isMilestone: boolean;
  milestoneDay: number;
  rewardCurrency: number;
  isAlreadyDone: boolean;
}

interface StreakContextValue {
  streakData: StreakData;
  completeStudy: () => StreakResult;
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  streakShield: false,
  studyHistory: [],
};

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isYesterday(dateStr: string, today: string): boolean {
  const [y, m, d] = today.split('-').map(Number);
  const prev = new Date(y, m - 1, d);
  prev.setDate(prev.getDate() - 1);
  return toDateStr(prev) === dateStr;
}

function loadStreak(): StreakData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultStreak, ...JSON.parse(stored) } : defaultStreak;
  } catch { return defaultStreak; }
}

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const [streakData, setStreakData] = useState<StreakData>(loadStreak);

  const completeStudy = useCallback((): StreakResult => {
    const today = toDateStr(new Date());

    if (streakData.lastStudyDate === today) {
      return {
        currentStreak: streakData.currentStreak,
        isNewRecord: false,
        isMilestone: false,
        milestoneDay: 0,
        rewardCurrency: 0,
        isAlreadyDone: true,
      };
    }

    let newStreak: number;
    let newShield = streakData.streakShield;

    if (!streakData.lastStudyDate) {
      newStreak = 1;
    } else if (isYesterday(streakData.lastStudyDate, today)) {
      newStreak = streakData.currentStreak + 1;
    } else if (streakData.streakShield) {
      newStreak = streakData.currentStreak;
      newShield = false;
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(streakData.longestStreak, newStreak);
    const newHistory = streakData.studyHistory.includes(today)
      ? streakData.studyHistory
      : [...streakData.studyHistory, today];

    const next: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastStudyDate: today,
      streakShield: newShield,
      studyHistory: newHistory,
    };

    setStreakData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    const isMilestone = newStreak > 0 && newStreak % 7 === 0;
    const isNewRecord = newStreak > streakData.longestStreak;

    return {
      currentStreak: newStreak,
      isNewRecord,
      isMilestone,
      milestoneDay: isMilestone ? newStreak : 0,
      rewardCurrency: isMilestone ? (newStreak / 7) * 50 : 0,
      isAlreadyDone: false,
    };
  }, [streakData]);

  return (
    <StreakContext.Provider value={{ streakData, completeStudy }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within StreakProvider');
  return ctx;
}

export { toDateStr };
