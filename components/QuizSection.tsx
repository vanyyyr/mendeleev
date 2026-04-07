'use client';

import React from 'react';
import styles from './StoryModal.module.css';

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  difficulty: number;
  options: string[];
  explanation?: string;
}

interface QuizSectionProps {
  question: Question;
  selectedOption: string | null;
  showExplanation: boolean;
  questionsTotal: number;
  currentIndex: number;
  correctCount: number;
  allCompleted: boolean;
  onSelect: (option: string) => void;
  onNext: () => void;
  hasNextQuestion: boolean;
}

export default function QuizSection({
  question,
  selectedOption,
  showExplanation,
  questionsTotal,
  currentIndex,
  correctCount,
  allCompleted,
  onSelect,
  onNext,
  hasNextQuestion,
}: QuizSectionProps) {
  const difficultyLabel = (d: number) => d === 1 ? 'Лёгкий' : d === 2 ? 'Средний' : 'Сложный';

  const progressPercent = questionsTotal > 0
    ? ((currentIndex + (selectedOption === question.correctAnswer ? 1 : 0)) / questionsTotal) * 100
    : 0;

  const getOptionClass = (option: string): string => {
    if (!selectedOption) return styles.optionButton;
    if (selectedOption === option) {
      return option === question.correctAnswer
        ? `${styles.optionButton} ${styles.optionCorrect}`
        : `${styles.optionButton} ${styles.optionIncorrect}`;
    }
    if (option === question.correctAnswer) {
      return `${styles.optionButton} ${styles.optionReveal}`;
    }
    return `${styles.optionButton} ${styles.optionDisabled}`;
  };

  return (
    <div className={styles.testSection}>
      <div className={styles.testHeader}>
        <h3>Проверка знаний</h3>
        {questionsTotal > 0 && (
          <span className={styles.questionCounter}>
            {currentIndex + 1} / {questionsTotal}
          </span>
        )}
      </div>

      {questionsTotal > 0 && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      <div className={styles.questionMeta}>
        <span className={`${styles.difficultyBadge} ${styles[`difficulty${question.difficulty}`]}`}>
          {difficultyLabel(question.difficulty)}
        </span>
      </div>

      <p className={styles.questionText}>{question.text}</p>

      <div className={styles.testOptions}>
        {question.options.map((option) => (
          <button
            key={option}
            className={getOptionClass(option)}
            onClick={() => onSelect(option)}
            disabled={selectedOption === question.correctAnswer}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && question.explanation && selectedOption !== question.correctAnswer && (
        <div className={styles.explanation}>
          <strong>Объяснение:</strong> {question.explanation}
        </div>
      )}

      {!allCompleted && selectedOption === question.correctAnswer && hasNextQuestion && (
        <button className={styles.nextButton} onClick={onNext}>
          Следующий вопрос →
        </button>
      )}

      {allCompleted && (
        <div className={styles.completed}>
          <p>🎉 Ты ответил правильно на {correctCount} из {questionsTotal} вопросов!</p>
        </div>
      )}
    </div>
  );
}
