'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './analytics.module.css';

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsRequested: number;
  elementsViewed: number;
  accuracyRate: number;
  hintEffectiveness: number;
  errorByElement: Array<{ elementId: number; count: number }>;
  correctByElement: Array<{ elementId: number; count: number }>;
  eventsByDay: Array<{ day: string; correct: number; incorrect: number }>;
  hintsByElement: Array<{ elementId: number; count: number }>;
  topUsers: Array<{ userId: string; totalAnswers: number; correctAnswers: number; accuracy: number }>;
  heatmapData: Array<{ elementId: number; correct: number; incorrect: number; accuracy: number }>;
  recentEvents: Array<{
    id: string;
    userId: string;
    actionType: string;
    elementId: number | null;
    userAnswer: string | null;
    aiHint: string | null;
    timestamp: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const p = searchParams.get('p');
    if (p) {
      setPassword(p);
      setSubmitted(true);
      fetchAnalytics(p);
    }
  }, [searchParams]);

  const fetchAnalytics = async (pwd: string) => {
    try {
      const response = await fetch(`/api/analytics?p=${pwd}`);
      if (!response.ok) {
        setError('Неверный пароль или ошибка сервера');
        setData(null);
        return;
      }
      const json = await response.json();
      setData(json);
      setError('');
    } catch {
      setError('Не удалось загрузить данные');
      setData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    fetchAnalytics(password);
  };

  if (!submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1>📊 Аналитика Mendeleev AI</h1>
          <p>Введите пароль для доступа к дашборду</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              className={styles.passwordInput}
              autoFocus
            />
            <button type="submit" className={styles.loginButton}>
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h1>⚠️ Ошибка доступа</h1>
          <p>{error}</p>
          <button onClick={() => { setSubmitted(false); setError(''); }} className={styles.loginButton}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className={styles.container}><p>Загрузка...</p></div>;
  }

  const getSymbol = (atomicNum: number | null): string => {
    if (!atomicNum) return '—';
    const map: Record<number, string> = {
      1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne',
      11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar', 19: 'K', 20: 'Ca',
    };
    return map[atomicNum] || `#${atomicNum}`;
  };

  const maxErrors = Math.max(...data.errorByElement.map(e => e.count), 1);
  const maxDaily = Math.max(...data.eventsByDay.map(d => d.correct + d.incorrect), 1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📊 Аналитика Mendeleev AI</h1>
        <div className={styles.headerActions}>
          <button onClick={() => fetchAnalytics(password)} className={styles.refreshButton}>
            Обновить
          </button>
          <a
            href={`/api/export/csv?p=${password}`}
            download
            className={styles.exportButton}
          >
            Экспорт CSV
          </a>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            ← К таблице
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.totalUsers}</div>
          <div className={styles.statLabel}>Уникальных пользователей</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.totalEvents}</div>
          <div className={styles.statLabel}>Всего событий</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.elementsViewed}</div>
          <div className={styles.statLabel}>Просмотров элементов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.accuracyRate}%</div>
          <div className={styles.statLabel}>Точность ответов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#2e7d32' }}>{data.correctAnswers}</div>
          <div className={styles.statLabel}>Правильных ответов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#c62828' }}>{data.incorrectAnswers}</div>
          <div className={styles.statLabel}>Неправильных ответов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.hintsRequested}</div>
          <div className={styles.statLabel}>Запросов подсказок</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.hintEffectiveness}%</div>
          <div className={styles.statLabel}>Частота запросов подсказок</div>
        </div>
      </div>

      {data.eventsByDay.length > 0 && (
        <div className={styles.chartCard}>
          <h3>Активность по дням</h3>
          <div className={styles.dailyChart}>
            {data.eventsByDay.map(day => (
              <div key={day.day} className={styles.dailyBar}>
                <div className={styles.dailyBarTrack}>
                  <div
                    className={styles.dailyBarFillCorrect}
                    style={{ height: `${(day.correct / maxDaily) * 100}%` }}
                  />
                  <div
                    className={styles.dailyBarFillIncorrect}
                    style={{
                      height: `${(day.incorrect / maxDaily) * 100}%`,
                      marginTop: 'auto',
                    }}
                  />
                </div>
                <span className={styles.dailyLabel}>
                  {new Date(day.day).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.chartLegend}>
            <span className={styles.legendItem}><span className={styles.legendDotCorrect} /> Верно</span>
            <span className={styles.legendItem}><span className={styles.legendDotIncorrect} /> Неверно</span>
          </div>
        </div>
      )}

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Ошибки по элементам</h3>
          {data.errorByElement.length === 0 ? (
            <p className={styles.emptyText}>Нет данных об ошибках</p>
          ) : (
            <div className={styles.barChart}>
              {data.errorByElement.map(item => (
                <div key={item.elementId} className={styles.barRow}>
                  <span className={styles.barLabel}>{getSymbol(item.elementId)}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${(item.count / maxErrors) * 100}%`,
                        backgroundColor: item.count > 5 ? '#ef5350' : '#ffab91',
                      }}
                    />
                  </div>
                  <span className={styles.barValue}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3>Правильные ответы по элементам</h3>
          {data.correctByElement.length === 0 ? (
            <p className={styles.emptyText}>Нет данных</p>
          ) : (
            <div className={styles.barChart}>
              {data.correctByElement.map(item => (
                <div key={item.elementId} className={styles.barRow}>
                  <span className={styles.barLabel}>{getSymbol(item.elementId)}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${(item.count / maxErrors) * 100}%`,
                        backgroundColor: '#66bb6a',
                      }}
                    />
                  </div>
                  <span className={styles.barValue}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {data.heatmapData.length > 0 && (
        <div className={styles.chartCard}>
          <h3>Тепловая карта — точность по элементам</h3>
          <div className={styles.heatmapGrid}>
            {data.heatmapData.map(item => {
              const accuracy = item.accuracy;
              let bgColor = '#ffebee';
              let textColor = '#c62828';
              if (accuracy >= 80) {
                bgColor = '#e8f5e9';
                textColor = '#2e7d32';
              } else if (accuracy >= 60) {
                bgColor = '#fff8e1';
                textColor = '#e65100';
              } else if (accuracy >= 40) {
                bgColor = '#fff3e0';
                textColor = '#e65100';
              }

              return (
                <div
                  key={item.elementId}
                  className={styles.heatmapCell}
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  <span className={styles.heatmapSymbol}>{getSymbol(item.elementId)}</span>
                  <span className={styles.heatmapAccuracy}>{accuracy}%</span>
                  <span className={styles.heatmapCount}>{item.correct + item.incorrect} отв.</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.topUsers.length > 0 && (
        <div className={styles.chartCard}>
          <h3>Топ пользователей</h3>
          <div className={styles.usersTable}>
            <div className={styles.usersHeader}>
              <span>#</span>
              <span>Пользователь</span>
              <span>Ответов</span>
              <span>Верно</span>
              <span>Точность</span>
            </div>
            {data.topUsers.map((user, idx) => (
              <div key={user.userId} className={styles.userRow}>
                <span>{idx + 1}</span>
                <span className={styles.userId}>{user.userId.slice(0, 8)}...</span>
                <span>{user.totalAnswers}</span>
                <span>{user.correctAnswers}</span>
                <span className={`${styles.accuracyBadge} ${user.accuracy >= 70 ? styles.accuracyHigh : styles.accuracyLow}`}>
                  {user.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.recentSection}>
        <h3>Последние события</h3>
        <div className={styles.eventsTable}>
          <div className={styles.eventsHeader}>
            <span>Время</span>
            <span>Пользователь</span>
            <span>Действие</span>
            <span>Элемент</span>
            <span>Ответ</span>
          </div>
          {data.recentEvents.map(event => (
            <div key={event.id} className={styles.eventRow}>
              <span>{new Date(event.timestamp).toLocaleString('ru-RU')}</span>
              <span className={styles.userId}>{event.userId.slice(0, 8)}...</span>
              <span className={`${styles.actionBadge} ${styles[event.actionType]}`}>
                {event.actionType === 'ANSWER_CORRECT' && '✅ Верно'}
                {event.actionType === 'ANSWER_INCORRECT' && '❌ Неверно'}
                {event.actionType === 'HINT_REQUESTED' && '💡 Подсказка'}
                {event.actionType === 'ELEMENT_VIEWED' && '👁 Просмотр'}
              </span>
              <span>{getSymbol(event.elementId)}</span>
              <span>{event.userAnswer || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
