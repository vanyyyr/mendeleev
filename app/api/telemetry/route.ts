import { NextResponse } from 'next/server';
import { getPrisma, isDbAvailable } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, actionType, elementId, questionId, userAnswer, aiHint } = body;

    if (!userId || !actionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isDbAvailable()) {
      return NextResponse.json({ success: true, event: { id: 'local-' + Date.now() } }, { status: 201 });
    }

    const db = getPrisma();

    if (elementId) {
      const existingState = await db.userState.findFirst({
        where: { userId },
      });

      if (existingState) {
        await db.userState.update({
          where: { id: existingState.id },
          data: { currentElementId: elementId },
        });
      } else {
        await db.userState.create({
          data: { userId, currentElementId: elementId },
        });
      }
    }

    const event = await db.telemetryEvent.create({
      data: {
        userId,
        actionType,
        elementId,
        questionId,
        userAnswer,
        aiHint,
      },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error('Ошибка записи телеметрии:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
