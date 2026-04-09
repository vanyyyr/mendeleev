import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const openRouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  fetch: async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Mendeleev AI Chat',
      },
    });
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context } = body;

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
    }

    const systemPrompt = `Ты — эмпатичный AI-репетитор по химии для школьников 8-11 классов. 
Ты знаешь ВСЮ таблицу Менделеева (118 элементов) и можешь ответить на ЛЮБОЙ вопрос о химии.

Правила:
1. Отвечай на русском языке, понятным школьникам языком
2. Если спрашивают про элемент — давай полную информацию: атомный номер, символ, группа, период, свойства, применение
3. Объясняй через периодический закон и положение в таблице
4. Будь тёплым и поддерживающим
5. Используй примеры из повседневной жизни
6. Можешь объяснять химические реакции, строение атома, электронные конфигурации
7. Если не знаешь точный ответ — честно скажи об этом
8. Можешь задавать вопросы ученику для проверки понимания

Начни с приветствия и предложи помощь с химией!`;

    const result = await streamText({
      model: openRouter('google/gemma-2-9b-it:free'),
      system: systemPrompt,
      messages: messages || [],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка генерации ответа. Попробуйте ещё раз.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}