'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { getOrCreateUserId } from '../session';
import { getLevelTitle, getXpForNextLevel, getXpFromPreviousLevel } from '../adaptive-testing';

interface ProgressData {
  elementsStudied: number[];
  totalCorrect: number;
  totalIncorrect: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  xp: number;
  currentDifficulty: number;
  consecutiveCorrect: number;
}

interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface ProgressContextValue {
  progress: ProgressData | null;
  achievements: Achievement[];
  loading: boolean;
  recordAnswer: (wasCorrect: boolean, elementId?: number) => Promise<{
    progress: ProgressData;
    adaptiveResult: { newDifficulty: number; shouldIncrease: boolean; shouldDecrease: boolean; xpGained: number };
    leveledUp: boolean;
    newAchievements: Achievement[];
  } | null>;
  refreshProgress: () => void;
  levelTitle: string;
  xpForNext: number;
  xpFromPrev: number;
  xpProgress: number;
  userId: string;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const fetchProgress = useCallback(async () => {
    const id = getOrCreateUserId();
    setUserId(id);
    try {
      const res = await fetch(`/api/progress?userId=${id}`);
      const data = await res.json();
      setProgress(data.progress);
      setAchievements(data.achievements || []);
    } catch {
      // Graceful fallback — offline mode
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const recordAnswer = useCallback(async (wasCorrect: boolean, elementId?: number) => {
    const id = getOrCreateUserId();
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, wasCorrect, elementId }),
      });
      const data = await res.json();
      setProgress(data.progress);
      return data;
    } catch {
      return null;
    }
  }, []);

  const levelTitle = progress ? getLevelTitle(progress.level) : '';
  const xpForNext = progress ? getXpForNextLevel(progress.level) : 50;
  const xpFromPrev = progress ? getXpFromPreviousLevel(progress.level) : 0;
  const xpProgress = progress
    ? Math.min(100, Math.max(0, ((progress.xp - xpFromPrev) / (xpForNext - xpFromPrev)) * 100))
    : 0;

  const value = useMemo<ProgressContextValue>(() => ({
    progress,
    achievements,
    loading,
    recordAnswer,
    refreshProgress: fetchProgress,
    levelTitle,
    xpForNext,
    xpFromPrev,
    xpProgress,
    userId,
  }), [progress, achievements, loading, recordAnswer, fetchProgress, levelTitle, xpForNext, xpFromPrev, xpProgress, userId]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return ctx;
}
