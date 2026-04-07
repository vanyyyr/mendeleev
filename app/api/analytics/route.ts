import { NextResponse } from 'next/server';
import { getPrisma, isDbAvailable } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    if (!isDbAvailable()) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const db = getPrisma();

    const authHeader = req.headers.get('authorization');
    const password = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (password !== process.env.ANALYTICS_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalUsers = await db.telemetryEvent.groupBy({
      by: ['userId'],
    });

    const totalEvents = await db.telemetryEvent.count();

    const correctAnswers = await db.telemetryEvent.count({
      where: { actionType: 'ANSWER_CORRECT' },
    });

    const incorrectAnswers = await db.telemetryEvent.count({
      where: { actionType: 'ANSWER_INCORRECT' },
    });

    const hintsRequested = await db.telemetryEvent.count({
      where: { actionType: 'HINT_REQUESTED' },
    });

    const elementsViewed = await db.telemetryEvent.count({
      where: { actionType: 'ELEMENT_VIEWED' },
    });

    const errorByElement = await db.$queryRaw<
      Array<{ elementId: number; count: number }>
    >`
      SELECT "elementId", COUNT(*)::int as count
      FROM "TelemetryEvent"
      WHERE "actionType" = 'ANSWER_INCORRECT'
      AND "elementId" IS NOT NULL
      GROUP BY "elementId"
      ORDER BY count DESC
    `;

    const correctByElement = await db.$queryRaw<
      Array<{ elementId: number; count: number }>
    >`
      SELECT "elementId", COUNT(*)::int as count
      FROM "TelemetryEvent"
      WHERE "actionType" = 'ANSWER_CORRECT'
      AND "elementId" IS NOT NULL
      GROUP BY "elementId"
      ORDER BY count DESC
    `;

    const eventsByDay = await db.$queryRaw<
      Array<{ day: string; correct: number; incorrect: number }>
    >`
      SELECT 
        DATE("timestamp")::text as day,
        COUNT(*) FILTER (WHERE "actionType" = 'ANSWER_CORRECT')::int as correct,
        COUNT(*) FILTER (WHERE "actionType" = 'ANSWER_INCORRECT')::int as incorrect
      FROM "TelemetryEvent"
      WHERE "actionType" IN ('ANSWER_CORRECT', 'ANSWER_INCORRECT')
      GROUP BY DATE("timestamp")
      ORDER BY day ASC
    `;

    const hintsByElement = await db.$queryRaw<
      Array<{ elementId: number; count: number }>
    >`
      SELECT "elementId", COUNT(*)::int as count
      FROM "TelemetryEvent"
      WHERE "actionType" = 'HINT_REQUESTED'
      AND "elementId" IS NOT NULL
      GROUP BY "elementId"
      ORDER BY count DESC
    `;

    const topUsers = await db.$queryRaw<
      Array<{ userId: string; totalAnswers: number; correctAnswers: number; accuracy: number }>
    >`
      SELECT 
        "userId",
        COUNT(*)::int as "totalAnswers",
        COUNT(*) FILTER (WHERE "actionType" = 'ANSWER_CORRECT')::int as "correctAnswers",
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(*) FILTER (WHERE "actionType" = 'ANSWER_CORRECT')::numeric / COUNT(*)::numeric) * 100)
          ELSE 0 
        END::int as accuracy
      FROM "TelemetryEvent"
      WHERE "actionType" IN ('ANSWER_CORRECT', 'ANSWER_INCORRECT')
      GROUP BY "userId"
      ORDER BY "totalAnswers" DESC
      LIMIT 10
    `;

    const recentEvents = await db.telemetryEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    const accuracyRate = correctAnswers + incorrectAnswers > 0
      ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100)
      : 0;

    const hintEffectiveness = incorrectAnswers > 0
      ? Math.round((hintsRequested / incorrectAnswers) * 100)
      : 0;

    const heatmapData: Array<{ elementId: number; correct: number; incorrect: number; accuracy: number }> = [];
    const allElementIds = new Set([
      ...errorByElement.map(e => e.elementId),
      ...correctByElement.map(e => e.elementId),
    ]);

    for (const elementId of allElementIds) {
      const correct = correctByElement.find(e => e.elementId === elementId)?.count || 0;
      const incorrect = errorByElement.find(e => e.elementId === elementId)?.count || 0;
      const total = correct + incorrect;
      heatmapData.push({
        elementId,
        correct,
        incorrect,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      });
    }

    heatmapData.sort((a, b) => a.accuracy - b.accuracy);

    return NextResponse.json({
      totalUsers: totalUsers.length,
      totalEvents,
      correctAnswers,
      incorrectAnswers,
      hintsRequested,
      elementsViewed,
      accuracyRate,
      hintEffectiveness,
      errorByElement,
      correctByElement,
      eventsByDay,
      hintsByElement,
      topUsers,
      heatmapData,
      recentEvents,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
