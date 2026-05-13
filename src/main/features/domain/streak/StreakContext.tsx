import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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

const STORAGE_KEY = 'scoi_streak';

const defaultData: StreakData = {
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

function load(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { ...defaultData };
}

function save(data: StreakData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface StreakContextValue {
  streakData: StreakData;
  completeStudy: () => StreakResult;
  toDateStr: (date: Date) => string;
}

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streakData, setStreakData] = useState<StreakData>(load);

  useEffect(() => {
    save(streakData);
  }, [streakData]);

  const completeStudy = (): StreakResult => {
    const today = toDateStr(new Date());
    const data = load();

    if (data.lastStudyDate === today) {
      return {
        currentStreak: data.currentStreak,
        isNewRecord: false,
        isMilestone: false,
        milestoneDay: 0,
        rewardCurrency: 0,
        isAlreadyDone: true,
      };
    }

    const yesterday = toDateStr(new Date(Date.now() - 86400000));
    let newStreak: number;

    if (data.lastStudyDate === yesterday) {
      newStreak = data.currentStreak + 1;
    } else if (data.lastStudyDate !== null && data.streakShield) {
      newStreak = data.currentStreak;
    } else {
      newStreak = 1;
    }

    const shieldConsumed = data.lastStudyDate !== null && data.lastStudyDate !== yesterday && data.streakShield;
    const isMilestone = newStreak % 7 === 0;
    const rewardCurrency = isMilestone ? (newStreak / 7) * 50 : 0;
    const newLongest = Math.max(newStreak, data.longestStreak);

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastStudyDate: today,
      streakShield: shieldConsumed ? false : data.streakShield,
      studyHistory: data.studyHistory.includes(today)
        ? data.studyHistory
        : [...data.studyHistory, today],
    };

    save(newData);
    setStreakData(newData);

    return {
      currentStreak: newStreak,
      isNewRecord: newStreak > data.longestStreak,
      isMilestone,
      milestoneDay: isMilestone ? newStreak : 0,
      rewardCurrency,
      isAlreadyDone: false,
    };
  };

  return (
    <StreakContext.Provider value={{ streakData, completeStudy, toDateStr }}>
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
