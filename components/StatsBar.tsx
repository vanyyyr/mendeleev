'use client';

import React from 'react';
import styles from './StatsBar.module.css';
import { useProgressContext } from '../lib/contexts/ProgressContext';

export default function StatsBar() {
  const { progress, loading, levelTitle, xpProgress, xpForNext, achievements } = useProgressContext();

  if (loading || !progress) {
    return (
      <nav className={styles.container} aria-label="Статистика пользователя">
        <div className={styles.loading}>Загрузка прогресса...</div>
      </nav>
    );
  }

  return (
    <nav className={styles.container} aria-label="Статистика пользователя">
      <div className={styles.stat}>
        <span className={styles.statIcon}>🎓</span>
        <div>
          <div className={styles.statLabel}>Уровень {progress.level}</div>
          <div className={styles.statValue}>{levelTitle}</div>
        </div>
      </div>

      <div className={styles.xpSection}>
        <div
          className={styles.xpBar}
          role="progressbar"
          aria-valuenow={progress.xp}
          aria-valuemin={0}
          aria-valuemax={xpForNext}
          aria-label={`Опыт: ${progress.xp} из ${xpForNext}`}
        >
          <div className={styles.xpFill} style={{ width: `${xpProgress}%` }} />
        </div>
        <span className={styles.xpText}>{progress.xp} / {xpForNext} XP</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.statIcon}>📚</span>
        <div>
          <div className={styles.statLabel}>Изучено</div>
          <div className={styles.statValue}>{progress.elementsStudied.length} / 118</div>
        </div>
      </div>

      <div className={styles.stat}>
        <span className={styles.statIcon}>🔥</span>
        <div>
          <div className={styles.statLabel}>Серия</div>
          <div className={styles.statValue}>{progress.currentStreak}</div>
        </div>
      </div>

      <div className={styles.stat}>
        <span className={styles.statIcon}>🏆</span>
        <div>
          <div className={styles.statLabel}>Достижения</div>
          <div className={styles.statValue}>{achievements.length}</div>
        </div>
      </div>
    </nav>
  );
}
