import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const mimo = createOpenAI({
  baseURL: 'https://api.xiaomimimo.com/v1',
  apiKey: process.env.MIMO_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context } = body;

    if (!process.env.MIMO_API_KEY) {
      console.error('MIMO_API_KEY is missing in environment variables');
      return NextResponse.json({ error: 'MIMO_API_KEY not configured' }, { status: 500 });
    }

    console.log('Sending direct request to Xiaomi MIMO with messages:', messages?.length);

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

    const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MIMO_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mimo-v2-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(messages || [])
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MIMO API Error:', response.status, errorText);
      throw new Error(`MIMO API Error: ${response.status}`);
    }

    // Return the stream directly. The frontend robustly parses the lines.
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка генерации ответа. Попробуйте ещё раз.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}