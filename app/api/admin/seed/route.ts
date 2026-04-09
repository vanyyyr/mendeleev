import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ELEMENTS_DATA } from '@/lib/elements-data';

export async function POST() {
  try {
    console.log('API Seed: Starting database synchronization...');
    
    // Clear existing questions and elements to ensure a clean state
    // Note: In a production environment with real users, you might want to use upsert instead.
    // However, for this pedagogical project, a clean seed is preferred to update descriptions and quiz questions.
    
    // First, delete questions (dependent on elements)
    await prisma.question.deleteMany({});
    
    // Synchronize elements
    let elementCount = 0;
    for (const el of ELEMENTS_DATA) {
      const { questions, ...elementData } = el;
      
      await prisma.element.upsert({
        where: { atomicNum: el.atomicNum },
        update: {
          ...elementData,
          questions: {
            create: questions
          }
        },
        create: {
          ...elementData,
          questions: {
            create: questions
          }
        }
      });
      elementCount++;
    }

    // Synchronize achievements
    const achievementData = [
      { code: 'first_element', name: 'Первый шаг', description: 'Изучи свой первый элемент', icon: '🧪', condition: '{"type":"elementsStudied","min":1}' },
      { code: 'five_elements', name: 'Коллекционер', description: 'Изучи 5 элементов', icon: '🔬', condition: '{"type":"elementsStudied","min":5}' },
      { code: 'ten_elements', name: 'Знаток таблицы', description: 'Изучи 10 элементов', icon: '📚', condition: '{"type":"elementsStudied","min":10}' },
      { code: 'all_period_1', name: 'Первый период', description: 'Изучи все элементы 1-го периода (H, He)', icon: '⚛️', condition: '{"type":"periodComplete","period":1}' },
      { code: 'all_period_2', name: 'Второй период', description: 'Изучи все элементы 2-го периода', icon: '🌟', condition: '{"type":"periodComplete","period":2}' },
      { code: 'all_period_3', name: 'Третий период', description: 'Изучи все элементы 3-го периода', icon: '🏆', condition: '{"type":"periodComplete","period":3}' },
      { code: 'streak_5', name: 'На волне', description: 'Ответь правильно 5 раз подряд', icon: '🔥', condition: '{"type":"streak","min":5}' },
      { code: 'streak_10', name: 'Неудержимый', description: 'Ответь правильно 10 раз подряд', icon: '💥', condition: '{"type":"streak","min":10}' },
      { code: 'first_10_correct', name: 'Ученик', description: 'Дай 10 правильных ответов', icon: '✅', condition: '{"type":"totalCorrect","min":10}' },
      { code: 'first_50_correct', name: 'Химик', description: 'Дай 50 правильных ответов', icon: '🎓', condition: '{"type":"totalCorrect","min":50}' },
      { code: 'level_5', name: 'Лаборант', description: 'Достигни 5 уровня', icon: '🧑‍🔬', condition: '{"type":"level","min":5}' },
      { code: 'level_10', name: 'Менделеев', description: 'Достигни максимального 10 уровня', icon: '👑', condition: '{"type":"level","min":10}' },
      { code: 'hard_mode', name: 'Бесстрашный', description: 'Дойди до максимальной сложности', icon: '💪', condition: '{"type":"difficulty","min":3}' },
      { code: 'alkali_metals', name: 'Щелочная банда', description: 'Изучи все щелочные металлы (Li, Na, K)', icon: '⚡', condition: '{"type":"elements","ids":[3,11,19]}' },
      { code: 'noble_gases', name: 'Благородное семейство', description: 'Изучи все благородные газы (He, Ne, Ar)', icon: '🎈', condition: '{"type":"elements","ids":[2,10,18]}' },
    ];

    for (const achievement of achievementData) {
      await prisma.achievement.upsert({
        where: { code: achievement.code },
        update: achievement,
        create: achievement
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${elementCount} elements and ${achievementData.length} achievements synchronized successfully.`,
      elementCount,
      achievementCount: achievementData.length
    });
  } catch (error) {
    console.error('Seed API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
