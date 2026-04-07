import React from 'react';
import styles from './Mascot.module.css';
import { ChemicalElement } from '../lib/elements';

interface MascotProps {
  element: ChemicalElement;
  emotion?: 'happy' | 'thinking' | 'speaking';
}

export default function Mascot({ element, emotion = 'happy' }: MascotProps) {
  const colorMap: Record<string, string> = {
    'diatomic-nonmetal': '#2196F3',
    'noble-gas': '#9C27B0',
    'alkali-metal': '#F44336',
    'alkaline-earth-metal': '#FF9800',
    'metalloid': '#009688',
    'polyatomic-nonmetal': '#3F51B5',
    'post-transition-metal': '#00BCD4',
    'transition-metal': '#E91E63',
    'lanthanide': '#4CAF50',
    'actinide': '#FF7043',
    'unknown': '#78909C',
  };

  const mainColor = colorMap[element.category] || '#0984e3';

  return (
    <div className={`${styles.mascotContainer} ${styles[emotion]}`} aria-hidden="true">
      <svg width="100" height="100" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <g className={styles.orbits}>
          <ellipse cx="60" cy="60" rx="20" ry="50" transform="rotate(0, 60, 60)" fill="none" stroke={mainColor} strokeWidth="1.5" opacity="0.3" />
          <ellipse cx="60" cy="60" rx="20" ry="50" transform="rotate(60, 60, 60)" fill="none" stroke={mainColor} strokeWidth="1.5" opacity="0.3" />
          <ellipse cx="60" cy="60" rx="20" ry="50" transform="rotate(120, 60, 60)" fill="none" stroke={mainColor} strokeWidth="1.5" opacity="0.3" />
          {/* Electrons */}
          <circle className={styles.electron} cx="60" cy="10" r="3" fill={mainColor} opacity="0.8" />
          <circle className={styles.electron2} cx="77" cy="85" r="3" fill={mainColor} opacity="0.8" />
        </g>
        
        <circle className={styles.core} cx="60" cy="60" r="26" fill={mainColor} />
        <circle cx="60" cy="60" r="26" fill="url(#coreGlow)" />
        
        <defs>
          <radialGradient id="coreGlow" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Face */}
        <g className={styles.face}>
          {emotion === 'thinking' ? (
            <>
              <line x1="45" y1="52" x2="52" y2="52" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="55" x2="75" y2="55" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="58" r="2.5" fill="#fff" />
              <circle cx="70" cy="58" r="2.5" fill="#fff" />
              <circle cx="62" cy="68" r="3.5" fill="#fff" />
            </>
          ) : emotion === 'speaking' ? (
            <>
              <circle cx="50" cy="55" r="3.5" fill="#fff" />
              <circle cx="70" cy="55" r="3.5" fill="#fff" />
              <ellipse className={styles.mouth} cx="60" cy="68" rx="5" ry="3.5" fill="#fff" />
            </>
          ) : (
            <>
              <path d="M 45 55 Q 50 48 55 55" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 65 55 Q 70 48 75 55" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 50 65 Q 60 75 70 65" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Symbol overlay */}
        <text x="60" y="84" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.4)" textAnchor="middle">
          {element.symbol}
        </text>
      </svg>
    </div>
  );
}
