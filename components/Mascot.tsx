import React from 'react';
import styles from './Mascot.module.css';
import Image from 'next/image';
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
        <Image 
          src="/mascot.png"
          alt="AI Tutor Mascot"
          width={100}
          height={100}
          className={styles.mascotImage}
          priority
        />
        <div className={styles.elementBadge} style={{ backgroundColor: mainColor }}>
          {element.symbol}
        </div>
      </div>
    </div>
  );
}
