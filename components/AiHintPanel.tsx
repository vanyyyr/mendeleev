'use client';

import React from 'react';
import styles from './StoryModal.module.css';

interface AiHintPanelProps {
  hint: string | null;
  isLoading: boolean;
}

export default function AiHintPanel({ hint, isLoading }: AiHintPanelProps) {
  if (isLoading) {
    return (
      <div className={styles.aiHint}>
        <span className={styles.aiIcon}>🤖</span>
        <p className={styles.aiHintLoading}>Ваш атом обдумывает подсказку<span className={styles.dots}>...</span></p>
      </div>
    );
  }

  if (!hint) return null;

  return (
    <div className={styles.aiHint} aria-live="polite">
      <span className={styles.aiIcon}>💡</span>
      <p>{hint}</p>
    </div>
  );
}
