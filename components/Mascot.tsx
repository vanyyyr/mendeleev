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
  };

  const mainColor = colorMap[element.category] || '#0984e3';

  return (
    <div 
      className={`${styles.mascotContainer} ${styles[emotion]}`} 
      aria-hidden="true"
      style={{"--glow-color": mainColor} as React.CSSProperties}
    >
      <div className={styles.mascotImageWrapper}>
        <svg 
          viewBox="0 0 100 100" 
          width={100} 
          height={100}
          className={styles.mascotImage}
        >
          <circle cx="50" cy="50" r="45" fill={mainColor}/>
          <circle cx="35" cy="40" r="8" fill="white"/>
          <circle cx="65" cy="40" r="8" fill="white"/>
          <circle cx="37" cy="38" r="3" fill={mainColor}/>
          <circle cx="67" cy="38" r="3" fill={mainColor}/>
          <path d="M 30 60 Q 50 75 70 60" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
        <div className={styles.elementBadge} style={{ backgroundColor: mainColor }}>
          {element.symbol}
        </div>
      </div>
    </div>
  );
}
