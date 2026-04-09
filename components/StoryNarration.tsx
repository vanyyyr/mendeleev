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
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onRestart?: () => void;
}

export default function StoryNarration({ 
  element, 
  emotion, 
  displayedStory, 
  applications,
  isPlaying,
  onPlayPause,
  onRestart
}: StoryNarrationProps) {
  return (
    <div className={styles.storySection}>
      <div className={styles.mascotWrapper}>
        <Mascot element={element} emotion={emotion} />
        
        {/* Audio Controls overlay/under */}
        <div className={styles.audioControls}>
          <button 
            className={styles.audioButton} 
            onClick={onPlayPause}
            title={isPlaying ? "Пауза" : "Играть"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <button 
            className={styles.audioButton} 
            onClick={onRestart}
            title="Заново"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.chatBubble} aria-live="polite">
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
