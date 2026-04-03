interface AdaptiveState {
  currentDifficulty: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  totalCorrect: number;
  totalIncorrect: number;
}

export interface AdaptiveResult {
  newDifficulty: number;
  shouldIncrease: boolean;
  shouldDecrease: boolean;
  xpGained: number;
}

export function calculateAdaptiveResult(
  state: AdaptiveState,
  wasCorrect: boolean
): AdaptiveResult {
  let newDifficulty = state.currentDifficulty;
  let xpGained = 0;

  if (wasCorrect) {
    const newConsecutive = state.consecutiveCorrect + 1;

    if (newConsecutive >= 3 && state.currentDifficulty < 3) {
      newDifficulty = state.currentDifficulty + 1;
      xpGained = 15 * newDifficulty;
    } else {
      xpGained = 10 * state.currentDifficulty;
    }
  } else {
    const newConsecutive = state.consecutiveIncorrect + 1;

    if (newConsecutive >= 2 && state.currentDifficulty > 1) {
      newDifficulty = state.currentDifficulty - 1;
    }
    xpGained = 2;
  }

  return {
    newDifficulty,
    shouldIncrease: newDifficulty > state.currentDifficulty,
    shouldDecrease: newDifficulty < state.currentDifficulty,
    xpGained,
  };
}

export function calculateLevel(xp: number): number {
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  if (xp < 500) return 4;
  if (xp < 800) return 5;
  if (xp < 1200) return 6;
  if (xp < 1700) return 7;
  if (xp < 2300) return 8;
  if (xp < 3000) return 9;
  return 10;
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Новичок',
    2: 'Ученик',
    3: 'Знаток',
    4: 'Химик',
    5: 'Лаборант',
    6: 'Исследователь',
    7: 'Профессор',
    8: 'Академик',
    9: 'Нобелевский лауреат',
    10: 'Менделеев',
  };
  return titles[level] || 'Новичок';
}

export function getXpForNextLevel(level: number): number {
  const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000, Infinity];
  return thresholds[level] || Infinity;
}

export function getXpFromPreviousLevel(level: number): number {
  const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000, Infinity];
  return thresholds[level - 1] || 0;
}
