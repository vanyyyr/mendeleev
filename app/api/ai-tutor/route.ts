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
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Mendeleev AI Tutor',
      },
    });
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      element,
      question,
      incorrectAnswer,
      correctAnswer,
      difficulty,
      consecutiveIncorrect,
      previousHints = [],
    } = body;

    const difficultyContext = difficulty === 1
      ? 'Ученик начального уровня. Используй простые аналогии и бытовые примеры.'
      : difficulty === 2
        ? 'Ученик среднего уровня. Можно использовать термины из школьного курса химии.'
        : 'Ученик продвинутого уровня. Можно использовать электронные конфигурации и закономерности таблицы.';

    const struggleContext = consecutiveIncorrect >= 3
      ? 'Ученик ошибся 3+ раза подряд. Дай максимально конкретную подсказку, почти по шагам, но всё ещё не давай ответ напрямую.'
      : consecutiveIncorrect >= 2
        ? 'Ученик ошибся 2 раза. Будь более конкретным — укажи на конкретное правило или свойство.'
        : '';

    const prevHintsContext = previousHints.length > 0
      ? `Твои предыдущие подсказки по этому вопросу: ${previousHints.map((h: string, i: number) => `[${i + 1}] ${h}`).join(' | ')}. Не повторяй их — дай новую подсказку с другой стороны.`
      : '';

    // Element periodic context
    const periodicContext = `
Элемент: ${element.name} (${element.symbol}), атомный номер ${element.atomicNum}.
Период ${element.period}, группа ${element.group || 'лантаноиды/актиноиды'}.
Категория: ${element.category}. Молярная масса: ${element.atomicMass}.`;

    const systemPrompt = `Ты — эмпатичный AI-репетитор по химии для школьников 8-11 классов. 
Сейчас ты играешь роль "ожившего" химического элемента ${element.name}.

${periodicContext}

Контекст ученика:
- ${difficultyContext}
${struggleContext ? `- ${struggleContext}` : ''}

Текущий вопрос: "${question}"
Ответ ученика: "${incorrectAnswer}"
Правильный ответ: "${correctAnswer}"
${prevHintsContext}

ПРАВИЛА:
1. НИКОГДА не давай правильный ответ напрямую — даже в завуалированной форме
2. Дай 1-2 предложения, которые наведут на правильную мысль
3. Объясни через положение в таблице Менделеева, электронное строение или периодические закономерности
4. Будь тёплым и поддерживающим — ошибка это часть учёбы!
5. Заверши наводящим вопросом, чтобы ученик подумал сам
6. НИКОГДА не галлюцинируй — только проверенные химические факты
7. Пиши на русском языке, простым школьным языком
8. Если это элемент из лантаноидов/актиноидов, расскажи об особенностях f-элементов`;

    const result = await streamText({
      model: openRouter('qwen/qwen3.6-plus:free'),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Я ответил неверно. Помоги мне понять, где я ошибся, но не говори правильный ответ.' }
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Tutor error:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка генерации подсказки. Попробуйте ещё раз.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
