import React from 'react';
import styles from './Mascot.module.css';
import { ChemicalElement } from '../lib/elements';

interface MascotProps {
  element: ChemicalElement;
  emotion?: 'happy' | 'thinking' | 'speaking';
}

export default function Mascot({ element, emotion = 'happy' }: MascotProps) {
  // Determine color based on category, simple hash for now
  const colorMap: Record<string, string> = {
    'diatomic_nonmetal': '#2196F3',
    'noble_gas': '#9C27B0',
    'alkali_metal': '#F44336',
    'alkaline_earth_metal': '#FF9800',
    'metalloid': '#009688',
    'polyatomic_nonmetal': '#3F51B5',
    'post_transition_metal': '#00BCD4',
    'transition_metal': '#E91E63',
  };

  const mainColor = colorMap[element.category] || '#0984e3';

  return (
    <div className={`${styles.mascotContainer} ${styles[emotion]}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <g className={styles.orbits}>
          <ellipse cx="60" cy="60" rx="20" ry="50" transform="rotate(0, 60, 60)" fill="none" stroke={mainColor} strokeWidth="2" opacity="0.4" />
          <ellipse cx="60" cy="60" rx="20" ry="50" transform="rotate(60, 60, 60)" fill="none" stroke={mainColor} strokeWidth="2" opacity="0.4" />
          <ellipse cx="60" cy="60" rx="20" ry="50" transform="rotate(120, 60, 60)" fill="none" stroke={mainColor} strokeWidth="2" opacity="0.4" />
        </g>
        
        <circle className={styles.core} cx="60" cy="60" r="28" fill={mainColor} />
        
        {/* Face */}
        <g className={styles.face}>
          {emotion === 'thinking' ? (
            <>
              {/* Thinking eyes */}
              <line x1="45" y1="52" x2="52" y2="52" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <line x1="68" y1="55" x2="75" y2="55" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="58" r="3" fill="#fff" />
              <circle cx="70" cy="58" r="3" fill="#fff" />
              {/* Mouth */}
              <circle cx="62" cy="68" r="4" fill="#fff" />
            </>
          ) : emotion === 'speaking' ? (
            <>
              {/* Normal eyes */}
              <circle cx="50" cy="55" r="4" fill="#fff" />
              <circle cx="70" cy="55" r="4" fill="#fff" />
              {/* Speaking mouth */}
              <ellipse cx="60" cy="68" rx="6" ry="4" fill="#fff" />
            </>
          ) : (
            <>
              {/* Happy eyes */}
              <path d="M 45 55 Q 50 48 55 55" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <path d="M 65 55 Q 70 48 75 55" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              {/* Smile mouth */}
              <path d="M 50 65 Q 60 75 70 65" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Symbol overlay */}
        <text x="60" y="85" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">
          {element.symbol}
        </text>
      </svg>
    </div>
  );
}
