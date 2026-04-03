import { NextResponse } from 'next/server';
import { prisma, isDbAvailable } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    if (!isDbAvailable()) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const password = searchParams.get('p');

    if (password !== process.env.ANALYTICS_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.telemetryEvent.findMany({
      orderBy: { timestamp: 'asc' },
    });

    const headers = ['ID', 'User ID', 'Action', 'Element ID', 'Question ID', 'User Answer', 'AI Hint', 'Timestamp'];
    const rows = events.map(e => [
      e.id,
      e.userId,
      e.actionType,
      e.elementId || '',
      e.questionId || '',
      e.userAnswer || '',
      e.aiHint || '',
      e.timestamp.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mendeleev-analytics-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
