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

 Основные правила:
 1. Отвечай кратко и по делу на русском языке
 2. Для элементов: дай ключевые facts (номер, символ, группа, важное свойство/применение)
 3. Используй школьную терминологию и простые аналогии
 4. Будь дружелюбным и поддерживающим
 5. Если не знаешь точного ответа — честно скажи об этом

 Приветствуй пользователя и предлагай помощь с химией.`;

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