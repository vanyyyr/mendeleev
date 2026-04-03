'use client';

import React, { useEffect, useState } from 'react';
import styles from './AchievementToast.module.css';

interface AchievementToastProps {
  name: string;
  description: string;
  icon: string;
  onDismiss: () => void;
}

export default function AchievementToast({ name, description, icon, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`${styles.toast} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.label}>Достижение разблокировано!</div>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <button className={styles.closeButton} onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}>
        ×
      </button>
    </div>
  );
}
