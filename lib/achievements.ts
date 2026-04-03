interface ProgressSnapshot {
  elementsStudied: number[];
  totalCorrect: number;
  totalIncorrect: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  xp: number;
  currentDifficulty: number;
}

interface AchievementDef {
  code: string;
  name: string;
  description: string;
  icon: string;
  check: (progress: ProgressSnapshot) => boolean;
}

export const achievementDefinitions: AchievementDef[] = [
  {
    code: 'first_element',
    name: 'Первый шаг',
    description: 'Изучи свой первый элемент',
    icon: '🧪',
    check: (p) => p.elementsStudied.length >= 1,
  },
  {
    code: 'five_elements',
    name: 'Коллекционер',
    description: 'Изучи 5 элементов',
    icon: '🔬',
    check: (p) => p.elementsStudied.length >= 5,
  },
  {
    code: 'ten_elements',
    name: 'Знаток таблицы',
    description: 'Изучи 10 элементов',
    icon: '📚',
    check: (p) => p.elementsStudied.length >= 10,
  },
  {
    code: 'all_period_1',
    name: 'Первый период',
    description: 'Изучи все элементы 1-го периода (H, He)',
    icon: '⚛️',
    check: (p) => p.elementsStudied.includes(1) && p.elementsStudied.includes(2),
  },
  {
    code: 'all_period_2',
    name: 'Второй период',
    description: 'Изучи все элементы 2-го периода',
    icon: '🌟',
    check: (p) => {
      const period2 = [3, 4, 5, 6, 7, 8, 9, 10];
      return period2.every(n => p.elementsStudied.includes(n));
    },
  },
  {
    code: 'all_period_3',
    name: 'Третий период',
    description: 'Изучи все элементы 3-го периода',
    icon: '🏆',
    check: (p) => {
      const period3 = [11, 12, 13, 14, 15, 16, 17, 18];
      return period3.every(n => p.elementsStudied.includes(n));
    },
  },
  {
    code: 'streak_5',
    name: 'На волне',
    description: 'Ответь правильно 5 раз подряд',
    icon: '🔥',
    check: (p) => p.bestStreak >= 5,
  },
  {
    code: 'streak_10',
    name: 'Неудержимый',
    description: 'Ответь правильно 10 раз подряд',
    icon: '💥',
    check: (p) => p.bestStreak >= 10,
  },
  {
    code: 'first_10_correct',
    name: 'Ученик',
    description: 'Дай 10 правильных ответов',
    icon: '✅',
    check: (p) => p.totalCorrect >= 10,
  },
  {
    code: 'first_50_correct',
    name: 'Химик',
    description: 'Дай 50 правильных ответов',
    icon: '🎓',
    check: (p) => p.totalCorrect >= 50,
  },
  {
    code: 'level_5',
    name: 'Лаборант',
    description: 'Достигни 5 уровня',
    icon: '🧑‍🔬',
    check: (p) => p.level >= 5,
  },
  {
    code: 'level_10',
    name: 'Менделеев',
    description: 'Достигни максимального 10 уровня',
    icon: '👑',
    check: (p) => p.level >= 10,
  },
  {
    code: 'hard_mode',
    name: 'Бесстрашный',
    description: 'Дойди до максимальной сложности',
    icon: '💪',
    check: (p) => p.currentDifficulty >= 3,
  },
  {
    code: 'alkali_metals',
    name: 'Щелочная банда',
    description: 'Изучи все щелочные металлы (Li, Na, K)',
    icon: '⚡',
    check: (p) => p.elementsStudied.includes(3) && p.elementsStudied.includes(11) && p.elementsStudied.includes(19),
  },
  {
    code: 'noble_gases',
    name: 'Благородное семейство',
    description: 'Изучи все благородные газы (He, Ne, Ar)',
    icon: '🎈',
    check: (p) => p.elementsStudied.includes(2) && p.elementsStudied.includes(10) && p.elementsStudied.includes(18),
  },
];

export function checkNewAchievements(
  progress: ProgressSnapshot,
  unlockedCodes: string[]
): AchievementDef[] {
  return achievementDefinitions.filter(
    (a) => !unlockedCodes.includes(a.code) && a.check(progress)
  );
}
