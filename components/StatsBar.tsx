'use client';

import React from 'react';
import { useProgress } from '../lib/useProgress';
import styles from './StatsBar.module.css';

export default function StatsBar() {
  const { progress, achievements, loading, levelTitle, xpProgress } = useProgress();

  if (loading) return null;
  if (!progress) return null;

  return (
    <div className={styles.statsBar}>
      <div className={styles.levelInfo}>
        <span className={styles.levelBadge}>{progress.level}</span>
        <div className={styles.levelText}>
          <span className={styles.levelTitle}>{levelTitle}</span>
          <div className={styles.xpBar}>
            <div
              className={styles.xpFill}
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <span className={styles.xpText}>{progress.xp} XP</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{progress.elementsStudied.length}</span>
          <span className={styles.statLabel}>Изучено</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.correct}`}>{progress.totalCorrect}</span>
          <span className={styles.statLabel}>Верно</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.streak}`}>{progress.currentStreak}🔥</span>
          <span className={styles.statLabel}>Серия</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.achievements}`}>{achievements.length}🏆</span>
          <span className={styles.statLabel}>Достижения</span>
        </div>
      </div>
    </div>
  );
}
