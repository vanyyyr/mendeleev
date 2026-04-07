'use client';

import React from 'react';
import styles from './StoryModal.module.css';
import Mascot from './Mascot';
import { ChemicalElement } from '../lib/elements';

interface StoryNarrationProps {
  element: ChemicalElement;
  emotion: 'happy' | 'thinking' | 'speaking';
  displayedStory: string;
  applications?: string;
}

export default function StoryNarration({ element, emotion, displayedStory, applications }: StoryNarrationProps) {
  return (
    <div className={styles.storySection}>
      <Mascot element={element} emotion={emotion} />
      <div className={styles.chatBubble} aria-live="polite">
        <div className={styles.aiBadge}>
          <span className={styles.aiSparkle}>✨</span> Сгенерировано ИИ-Тьютором
        </div>
        {displayedStory}
        {applications && (
          <>
            <br /><br />
            <strong>Применение:</strong> {applications}
          </>
        )}
      </div>
    </div>
  );
}
