import { useState, useEffect, useCallback } from 'react';
import { getOrCreateUserId } from './session';
import { getLevelTitle, getXpForNextLevel, getXpFromPreviousLevel } from './adaptive-testing';

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

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getOrCreateUserId();
    fetch(`/api/progress?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setProgress(data.progress);
        setAchievements(data.achievements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const recordAnswer = useCallback(async (wasCorrect: boolean, elementId?: number) => {
    const userId = getOrCreateUserId();
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wasCorrect, elementId }),
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
  const xpProgress = progress ? ((progress.xp - xpFromPrev) / (xpForNext - xpFromPrev)) * 100 : 0;

  return {
    progress,
    achievements,
    loading,
    recordAnswer,
    levelTitle,
    xpForNext,
    xpFromPrev,
    xpProgress: Math.min(100, Math.max(0, xpProgress)),
  };
}
