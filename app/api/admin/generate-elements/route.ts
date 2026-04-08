import { NextResponse } from 'next/server';
import { getPrisma, isDbAvailable } from '@/lib/prisma';
import { elements } from '@/lib/elements';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const openRouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  fetch: async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Mendeleev AI Seed Gen',
      },
    });
  },
});

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    if (!isDbAvailable()) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    const password = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (process.env.NODE_ENV === 'production' && password !== process.env.ANALYTICS_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { count = 1 } = await req.json().catch(() => ({}));

    const db = getPrisma();
    const existingElementsDb = await db.element.findMany({ select: { atomicNum: true } });
    const existingIds = new Set(existingElementsDb.map(e => e.atomicNum));

    const missingElements = elements.filter(e => !existingIds.has(e.atomicNum)).slice(0, count);

    if (missingElements.length === 0) {
      return NextResponse.json({ message: 'All 118 elements are already populated.' });
    }

    const results = [];

    for (const el of missingElements) {
      // Use AI to generate content
      const { object } = await generateObject({
        model: openRouter('google/gemma-4-31b-it:free'),
        schema: z.object({
          description: z.string(),
          applications: z.string(),
          questions: z.array(z.object({
            text: z.string(),
            correctAnswer: z.string(),
            options: z.array(z.string()).length(4),
            explanation: z.string(),
            difficulty: z.number().min(1).max(3),
          })).length(3)
        }),
        prompt: `Сгенерируй педагогический контент для химического элемента: ${el.name} (атомный номер ${el.atomicNum}, символ ${el.symbol}, период ${el.period}, группа ${el.group}).
        
Требования:
1. description (строка): Приветствие от лица самого элемента ("Привет! Я — ${el.name}..."). Около 4-5 предложений. Интересные факты, свойства, где встречается. Язык: школьный, от 8 до 11 класса. Не пиши лишних кавычек.
2. applications (строка): 3-5 сфер применения или где элемент встречается в жизни/природе через запятую.
3. questions (массив из 3 вопросов):
   - Первый вопрос: сложность 1 (простое школьное знание или факт из описания).
   - Второй вопрос: сложность 2 (более глубокое химическое свойство).
   - Третий вопрос: сложность 1 или 2 (про электроны, группу или применение).
   Каждый вопрос содержит:
   - text: текст вопроса
   - correctAnswer: правильный ответ
   - options: строго 4 варианта ответа (включая правильный)
   - explanation: пояснение почему ответ правильный.
   - difficulty: 1 или 2 (число).
        
Обязательно верни только валидный JSON, соответствующий схеме.`
      });

      // Save to database
      const created = await db.element.create({
        data: {
          atomicNum: el.atomicNum,
          symbol: el.symbol,
          name: el.name,
          period: el.period,
          group: el.group,
          category: el.category,
          atomicMass: el.atomicMass,
          description: object.description,
          applications: object.applications,
          questions: {
            create: object.questions
          }
        }
      });
      results.push(created);
    }

    return NextResponse.json({
      message: `Generated and filled ${results.length} elements.`,
      elements: results.map(r => r.name)
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message || 'Error generating elements' }, { status: 500 });
  }
}
