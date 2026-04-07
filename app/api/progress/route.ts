import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateAdaptiveResult, calculateLevel } from '@/lib/adaptive-testing';
import { checkNewAchievements } from '@/lib/achievements';

const defaultProgress = {
  elementsStudied: [] as number[],
  totalCorrect: 0,
  totalIncorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  level: 1,
  xp: 0,
  currentDifficulty: 1,
  consecutiveCorrect: 0,
};

export async function POST(req: Request) {
  try {
    const { userId, wasCorrect, elementId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    let userState = await prisma.userState.findFirst({
      where: { userId },
    });

    if (!userState) {
      userState = await prisma.userState.create({
        data: {
          userId,
          currentElementId: elementId || 1,
        },
      });

      await prisma.userProgress.create({
        data: {
          userId,
          elementsStudied: elementId ? [elementId] : [],
        },
      });
    }

    let progress = await prisma.userProgress.findFirst({
      where: { userId },
    });

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          userId,
          elementsStudied: elementId ? [elementId] : [],
        },
      });
    }

    const existingAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const unlockedCodes = existingAchievements.map((ua) => ua.achievement.code);

    const adaptiveResult = calculateAdaptiveResult(
      {
        currentDifficulty: progress.currentDifficulty,
        consecutiveCorrect: progress.consecutiveCorrect,
        consecutiveIncorrect: 0,
        totalCorrect: progress.totalCorrect,
        totalIncorrect: progress.totalIncorrect,
      },
      wasCorrect
    );

    const newTotalCorrect = progress.totalCorrect + (wasCorrect ? 1 : 0);
    const newTotalIncorrect = progress.totalIncorrect + (wasCorrect ? 0 : 1);
    const newConsecutiveCorrect = wasCorrect ? progress.consecutiveCorrect + 1 : 0;
    const newStreak = wasCorrect ? progress.currentStreak + 1 : 0;
    const newBestStreak = Math.max(progress.bestStreak, newStreak);
    const newXp = progress.xp + adaptiveResult.xpGained;
    const newLevel = calculateLevel(newXp);

    let elementsStudied = [...progress.elementsStudied];
    if (elementId && !elementsStudied.includes(elementId) && wasCorrect) {
      elementsStudied.push(elementId);
    }

    const updatedProgress = await prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        totalCorrect: newTotalCorrect,
        totalIncorrect: newTotalIncorrect,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        level: newLevel,
        xp: newXp,
        currentDifficulty: adaptiveResult.newDifficulty,
        consecutiveCorrect: newConsecutiveCorrect,
        elementsStudied,
      },
    });

    if (elementId) {
      await prisma.userState.update({
        where: { id: userState.id },
        data: { currentElementId: elementId },
      });
    }

    const snapshot = {
      elementsStudied: updatedProgress.elementsStudied,
      totalCorrect: updatedProgress.totalCorrect,
      totalIncorrect: updatedProgress.totalIncorrect,
      currentStreak: updatedProgress.currentStreak,
      bestStreak: updatedProgress.bestStreak,
      level: updatedProgress.level,
      xp: updatedProgress.xp,
      currentDifficulty: updatedProgress.currentDifficulty,
    };

    const newAchievements = checkNewAchievements(snapshot, unlockedCodes);

    const unlockedAchievements = [];
    for (const achievement of newAchievements) {
      const dbAchievement = await prisma.achievement.findUnique({
        where: { code: achievement.code },
      });

      if (dbAchievement) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: dbAchievement.id,
          },
        });

        unlockedAchievements.push({
          code: achievement.code,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
        });
      }
    }

    return NextResponse.json({
      progress: updatedProgress,
      adaptiveResult,
      leveledUp: newLevel > progress.level,
      newAchievements: unlockedAchievements,
    });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const progress = await prisma.userProgress.findFirst({
      where: { userId },
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    if (!progress) {
      return NextResponse.json({
        progress: defaultProgress,
        achievements: [],
      });
    }

    return NextResponse.json({
      progress,
      achievements: userAchievements.map((ua) => ({
        code: ua.achievement.code,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        unlockedAt: ua.unlockedAt,
      })),
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}