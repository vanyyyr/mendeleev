import { elements, ChemicalElement } from './elements';

interface ElementLink {
  element: ChemicalElement;
  reason: string;
}

export function getRecommendedNextElement(
  currentAtomicNum: number,
  wasCorrect: boolean
): ElementLink | null {
  const current = elements.find(e => e.atomicNum === currentAtomicNum);
  if (!current) return null;

  if (wasCorrect) {
    const samePeriod = elements
      .filter(e => e.period === current.period && e.atomicNum > current.atomicNum)
      .sort((a, b) => a.atomicNum - b.atomicNum);

    if (samePeriod.length > 0) {
      return {
        element: samePeriod[0],
        reason: `Отлично! Ты освоил ${current.name}. Продолжим в том же периоде — следующий элемент: ${samePeriod[0].name} (${samePeriod[0].symbol}).`,
      };
    }

    const nextPeriod = elements
      .filter(e => e.period === current.period + 1)
      .sort((a, b) => a.atomicNum - b.atomicNum);

    if (nextPeriod.length > 0) {
      return {
        element: nextPeriod[0],
        reason: `Период пройден! Переходим к следующему — ${nextPeriod[0].name} (${nextPeriod[0].symbol}).`,
      };
    }
  }

  const sameGroup = elements
    .filter(e => e.group === current.group && e.atomicNum !== current.atomicNum)
    .sort((a, b) => Math.abs(a.atomicNum - current.atomicNum) - Math.abs(b.atomicNum - current.atomicNum));

  if (sameGroup.length > 0) {
    return {
      element: sameGroup[0],
      reason: `Попробуй изучить ${sameGroup[0].name} (${sameGroup[0].symbol}) — он в той же группе, что и ${current.name}, и имеет похожие свойства.`,
    };
  }

  return null;
}

export function getElementNeighbors(atomicNum: number): ChemicalElement[] {
  const current = elements.find(e => e.atomicNum === atomicNum);
  if (!current) return [];

  return elements.filter(e => {
    if (e.atomicNum === atomicNum) return false;
    const samePeriod = e.period === current.period;
    const sameGroup = e.group === current.group;
    const adjacentPeriod = Math.abs(e.period - current.period) === 1 && e.group === current.group;
    return samePeriod || sameGroup || adjacentPeriod;
  });
}

export function getElementsByCategory(category: string): ChemicalElement[] {
  return elements.filter(e => e.category === category);
}

export function getAdjacentElement(atomicNum: number, direction: 'prev' | 'next'): ChemicalElement | null {
  const sorted = [...elements].sort((a, b) => a.atomicNum - b.atomicNum);
  const idx = sorted.findIndex(e => e.atomicNum === atomicNum);
  if (idx === -1) return null;

  const targetIdx = direction === 'next' ? idx + 1 : idx - 1;
  if (targetIdx < 0 || targetIdx >= sorted.length) return null;
  return sorted[targetIdx];
}
