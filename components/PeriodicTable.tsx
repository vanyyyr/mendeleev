'use client';

import React, { useState, useEffect } from 'react';
import { elements, ChemicalElement } from '../lib/elements';
import styles from './PeriodicTable.module.css';
import StoryModal from './StoryModal';

interface PeriodicTableProps {
  externalSelection?: ChemicalElement | null;
  onExternalClear?: () => void;
}

export default function PeriodicTable({ externalSelection, onExternalClear }: PeriodicTableProps) {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
  };

  const getCategoryClass = (category: string) => {
    const formattedCategory = category.replace(/-/g, '_');
    return styles[formattedCategory] || '';
  };

  // Separate main grid elements from lanthanides/actinides
  const mainElements = elements.filter(el => el.group !== 0);
  const lanthanides = elements.filter(el => el.category === 'lanthanide' && el.group === 0);
  const actinides = elements.filter(el => el.category === 'actinide' && el.group === 0);

  const renderElement = (el: ChemicalElement, gridStyle?: React.CSSProperties) => {
    const isDimmed = activeCategory && el.category !== activeCategory;

    return (
      <div
        key={el.atomicNum}
        className={`${styles.element} ${getCategoryClass(el.category)} ${isDimmed ? styles.dimmed : ''}`}
        style={gridStyle}
        onClick={() => handleElementClick(el)}
        role="button"
        tabIndex={0}
        aria-label={`${el.name}, ${el.symbol}, атомный номер ${el.atomicNum}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleElementClick(el); } }}
      >
        <div className={styles.atomicNum}>{el.atomicNum}</div>
        <div className={styles.symbol}>{el.symbol}</div>
        <div className={styles.name}>{el.name}</div>
      </div>
    );
  };

  // Category legend data
  const categories = [
    { key: 'alkali-metal', label: 'Щелочные', color: '#ffebee' },
    { key: 'alkaline-earth-metal', label: 'Щёлоч.-зем.', color: '#fff8e1' },
    { key: 'transition-metal', label: 'Переходные', color: '#fce4ec' },
    { key: 'post-transition-metal', label: 'Постпереходные', color: '#e0f7fa' },
    { key: 'metalloid', label: 'Полуметаллы', color: '#e0f2f1' },
    { key: 'diatomic-nonmetal', label: 'Неметаллы', color: '#e3f2fd' },
    { key: 'polyatomic-nonmetal', label: 'Многоат. нем.', color: '#e8eaf6' },
    { key: 'noble-gas', label: 'Благородные', color: '#f3e5f5' },
    { key: 'lanthanide', label: 'Лантаноиды', color: '#e8f5e9' },
    { key: 'actinide', label: 'Актиноиды', color: '#fff3e0' },
    { key: 'unknown', label: 'Неизвестные', color: '#f5f5f5' },
  ];

  return (
    <>
      <div className={styles.container}>
        {/* Category Legend */}
        <div className={styles.legend}>
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`${styles.legendItem} ${activeCategory === cat.key ? styles.legendActive : ''}`}
              style={{ '--cat-color': cat.color } as React.CSSProperties}
              onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            >
              <span className={styles.legendDot} style={{ background: cat.color }} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Periodic Table Grid */}
        <div className={styles.table}>
          {mainElements.map((el) =>
            renderElement(el, {
              gridColumn: el.group,
              gridRow: el.period,
            })
          )}

          {/* Lanthanide/Actinide placeholder markers in main grid */}
          <div className={styles.seriesMarker} style={{ gridColumn: 3, gridRow: 6 }}>
            57-71
          </div>
          <div className={styles.seriesMarker} style={{ gridColumn: 3, gridRow: 7 }}>
            89-103
          </div>
        </div>

        {/* Lanthanides Row */}
        <div className={styles.seriesSection}>
          <div className={styles.seriesLabel}>Лантаноиды</div>
          <div className={styles.seriesRow}>
            {lanthanides.map((el) => renderElement(el))}
          </div>
        </div>

        {/* Actinides Row */}
        <div className={styles.seriesSection}>
          <div className={styles.seriesLabel}>Актиноиды</div>
          <div className={styles.seriesRow}>
            {actinides.map((el) => renderElement(el))}
          </div>
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
