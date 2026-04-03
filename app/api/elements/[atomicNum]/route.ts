import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ atomicNum: string }> }
) {
  try {
    const { atomicNum } = await params;
    const num = parseInt(atomicNum, 10);

    if (isNaN(num)) {
      return NextResponse.json({ error: 'Invalid atomic number' }, { status: 400 });
    }

    const element = await prisma.element.findUnique({
      where: { atomicNum: num },
      include: { questions: true },
    });

    if (!element) {
      return NextResponse.json({ error: 'Element not found' }, { status: 404 });
    }

    return NextResponse.json(element);
  } catch (error) {
    console.error('Error fetching element:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
