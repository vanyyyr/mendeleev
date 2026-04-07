'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PeriodicTable from '../components/PeriodicTable';
import SearchBar from '../components/SearchBar';
import { ChemicalElement } from '../lib/elements';
import { ProgressProvider } from '../lib/contexts/ProgressContext';

export default function Home() {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  const handleSearchSelect = (element: ChemicalElement) => {
    setSelectedElement(element);
  };

  return (
    <ProgressProvider>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>⚛️</span>
            Интерактивная таблица Менделеева
          </h1>
          <p className={styles.subtitle}>Ваш интеллектуальный гид по химии, управляемый нейросетями</p>
        </header>
        <SearchBar onSelect={handleSearchSelect} />
        <div className={styles.tableContainer}>
          <PeriodicTable externalSelection={selectedElement} onExternalClear={() => setSelectedElement(null)} />
        </div>
      </main>
    </ProgressProvider>
  );
}
