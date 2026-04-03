'use client';

import React, { useState, useEffect } from 'react';
import { elements, ChemicalElement } from '../lib/elements';
import styles from './PeriodicTable.module.css';
import StoryModal from './StoryModal';
import { getOrCreateUserId } from '../lib/session';

interface PeriodicTableProps {
  externalSelection?: ChemicalElement | null;
  onExternalClear?: () => void;
}

export default function PeriodicTable({ externalSelection, onExternalClear }: PeriodicTableProps) {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [studiedElements, setStudiedElements] = useState<Set<number>>(new Set());

  useEffect(() => {
    const userId = getOrCreateUserId();
    fetch(`/api/progress?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.progress?.elementsStudied) {
          setStudiedElements(new Set(data.progress.elementsStudied));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (externalSelection) {
      setSelectedElement(externalSelection);
    }
  }, [externalSelection]);

  const handleElementClick = (element: ChemicalElement) => {
    setSelectedElement(element);
  };

  const handleNavigate = (element: ChemicalElement) => {
    setSelectedElement(element);
  };

  const handleModalClose = () => {
    setSelectedElement(null);
    onExternalClear?.();
    const userId = getOrCreateUserId();
    fetch(`/api/progress?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.progress?.elementsStudied) {
          setStudiedElements(new Set(data.progress.elementsStudied));
        }
      })
      .catch(() => {});
  };

  const getCategoryClass = (category: string) => {
    const formattedCategory = category.replace(/-/g, '_');
    return styles[formattedCategory] || '';
  };

  const getStudiedClass = (atomicNum: number) => {
    return studiedElements.has(atomicNum) ? styles.studied : '';
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.table}>
          {elements.map((el) => {
            return (
              <div
                key={el.atomicNum}
                className={`${styles.element} ${getCategoryClass(el.category)} ${getStudiedClass(el.atomicNum)}`}
                style={{
                  gridColumn: el.group,
                  gridRow: el.period,
                }}
                onClick={() => handleElementClick(el)}
                role="button"
                tabIndex={0}
                aria-label={`${el.name}, атомный номер ${el.atomicNum}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleElementClick(el); }}
              >
                <div className={styles.atomicNum}>{el.atomicNum}</div>
                <div className={styles.symbol}>{el.symbol}</div>
                <div className={styles.name}>{el.name}</div>
                {studiedElements.has(el.atomicNum) && (
                  <div className={styles.studiedBadge} aria-label="Изучен">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedElement && (
        <StoryModal 
          element={selectedElement} 
          onClose={handleModalClose}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
