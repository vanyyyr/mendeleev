import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

const elementsData = [
  { atomicNum: 1, symbol: "H", name: "Водород", period: 1, group: 1, category: "diatomic-nonmetal", atomicMass: 1.008, description: "Привет! Я — Водород, самый лёгкий и самый распространённый элемент во Вселенной...", applications: "Топливо для ракет" },
  { atomicNum: 2, symbol: "He", name: "Гелий", period: 1, group: 18, category: "noble-gas", atomicMass: 4.0026, description: "Привет! Я — Гелий, благородный газ. Моя внешняя электронная оболочка полностью заполнена, поэтому я ни с кем не вступаю в реакцию!", applications: "Воздушные шары" },
  { atomicNum: 6, symbol: "C", name: "Углерод", period: 2, group: 14, category: "polyatomic-nonmetal", atomicMass: 12.011, description: "Привет! Я — Углерод, основа всей органической жизни! Я уникален: могу образовывать четыре связи и создавать бесконечные цепочки.", applications: "Основа органики, графит, алмаз" },
  { atomicNum: 8, symbol: "O", name: "Кислород", period: 2, group: 16, category: "diatomic-nonmetal", atomicMass: 15.999, description: "Привет! Я — Кислород, без меня ты бы не смог прочитать этот текст! Я обожаю забирать электроны у других элементов.", applications: "Дыхание, металлургия" }
];

export async function POST() {
  const db = getPrisma();
  let count = 0;
  for (const el of elementsData) {
    const exists = await db.element.findUnique({ where: { atomicNum: el.atomicNum } });
    if (!exists) {
      await db.element.create({ data: el });
      count++;
    }
  }
  return NextResponse.json({ success: true, count });
}
