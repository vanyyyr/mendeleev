'use client';

import React, { useState, useRef, useEffect } from 'react';
import { elements, ChemicalElement } from '../lib/elements';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSelect: (element: ChemicalElement) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.length > 0
    ? elements.filter(el =>
        el.name.toLowerCase().includes(query.toLowerCase()) ||
        el.symbol.toLowerCase().includes(query.toLowerCase()) ||
        el.atomicNum.toString().includes(query)
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (el: ChemicalElement) => {
    setQuery('');
    setIsOpen(false);
    setHighlighted(-1);
    onSelect(el);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0 && results[highlighted]) {
      e.preventDefault();
      handleSelect(results[highlighted]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.inputContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          placeholder="Поиск элемента (имя, символ, номер)..."
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); setHighlighted(-1); }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Поиск химического элемента"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {query && (
          <button
            className={styles.clearButton}
            onClick={() => { setQuery(''); setIsOpen(false); }}
            aria-label="Очистить поиск"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {results.map((el, idx) => (
            <li
              key={el.atomicNum}
              className={`${styles.option} ${idx === highlighted ? styles.highlighted : ''}`}
              onClick={() => handleSelect(el)}
              onMouseEnter={() => setHighlighted(idx)}
              role="option"
              aria-selected={idx === highlighted}
            >
              <span className={styles.optionSymbol}>{el.symbol}</span>
              <span className={styles.optionName}>{el.name}</span>
              <span className={styles.optionNum}>#{el.atomicNum}</span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className={styles.noResults}>
          Ничего не найдено по запросу «{query}»
        </div>
      )}
    </div>
  );
}
