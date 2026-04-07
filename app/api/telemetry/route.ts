import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, actionType, elementId, questionId, userAnswer, aiHint } = body;

    if (!userId || !actionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (elementId) {
      const existingState = await prisma.userState.findFirst({
        where: { userId },
      });

      if (existingState) {
        await prisma.userState.update({
          where: { id: existingState.id },
          data: { currentElementId: elementId },
        });
      } else {
        await prisma.userState.create({
          data: { userId, currentElementId: elementId },
        });
      }
    }

    const event = await prisma.telemetryEvent.create({
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