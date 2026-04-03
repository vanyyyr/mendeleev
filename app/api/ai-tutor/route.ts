import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openRouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  fetch: async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Mendeleev AI Tutor',
      },
    });
  },
});

export async function POST(req: Request) {
  try {
    const { element, question, incorrectAnswer, correctAnswer, difficulty, consecutiveIncorrect } = await req.json();

    const difficultyContext = difficulty === 1
      ? 'Ученик начального уровня.'
      : difficulty === 2
        ? 'Ученик среднего уровня.'
        : 'Ученик продвинутого уровня.';

    const struggleContext = consecutiveIncorrect >= 2
      ? 'Ученик уже несколько раз ошибся подряд. Будь особенно поддерживающим и дай более конкретную подсказку.'
      : '';

    const systemPrompt = `Ты — эмпатичный AI-репетитор по химии для школьников 8-11 классов. 
Сейчас ты играешь роль "ожившего" химического элемента ${element.name} (атомный номер ${element.atomicNum}).

Контекст:
- ${difficultyContext}
- ${struggleContext}
- Вопрос: "${question}"
- Ответ ученика: "${incorrectAnswer}"
- Правильный ответ: "${correctAnswer}"

ПРАВИЛА:
1. НИКОГДА не давай правильный ответ напрямую
2. Дай короткую подсказку (1-2 предложения), которая наведёт на правильную мысль
3. Используй химические законы, свойства элемента, положение в таблице Менделеева
4. Будь поддерживающим и ободряющим — ошибка это нормально!
5. Задай наводящий вопрос, чтобы ученик сам подумал
6. НИКОГДА не галлюцинируй факты — только проверенная химия
7. Пиши на русском языке, простым языком`;

    const result = await streamText({
      model: openRouter('qwen/qwen3.6-plus:free'),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Я ответил неверно. Помоги мне понять, где я ошибся.' }
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Ошибка генерации подсказки' }), { status: 500 });
  }
}
