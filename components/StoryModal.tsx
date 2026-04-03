'use client';

import React, { useState, useEffect } from 'react';
import { ChemicalElement } from '../lib/elements';
import styles from './StoryModal.module.css';
import Mascot from './Mascot';
import { getOrCreateUserId } from '../lib/session';
import { trackEvent } from '../lib/telemetry';
import { getRecommendedNextElement, getAdjacentElement } from '../lib/zpd-engine';
import AchievementToast from './AchievementToast';

interface StoryModalProps {
  element: ChemicalElement;
  onClose: () => void;
  onNavigate?: (element: ChemicalElement) => void;
}

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  difficulty: number;
  options: string[];
  explanation?: string;
}

export default function StoryModal({ element, onClose, onNavigate }: StoryModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [emotion, setEmotion] = useState<'happy' | 'thinking' | 'speaking'>('speaking');
  const [displayedStory, setDisplayedStory] = useState('');
  const [userId, setUserId] = useState('');
  const [elementData, setElementData] = useState<{ description: string; applications: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [recommendation, setRecommendation] = useState<{ element: ChemicalElement; reason: string } | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Array<{ code: string; name: string; description: string; icon: string }>>([]);

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
    trackEvent({ userId: id, actionType: 'ELEMENT_VIEWED', elementId: element.atomicNum });
  }, [element.atomicNum]);

  useEffect(() => {
    const fetchElementData = async () => {
      try {
        const response = await fetch(`/api/elements/${element.atomicNum}`);
        if (response.ok) {
          const data = await response.json();
          setElementData({ description: data.description, applications: data.applications });
          setQuestions(data.questions || []);
          setCurrentQuestionIndex(0);
          setCorrectCount(0);
        } else {
          setElementData(null);
          setQuestions([]);
        }
      } catch {
        setElementData(null);
        setQuestions([]);
      }
    };

    fetchElementData();
  }, [element.atomicNum]);

  const story = elementData?.description || `Привет! Я — ${element.name}, живой атом! Мой номер в таблице — ${element.atomicNum}. В чистом виде я могу быть очень активным, но в природе чаще встречаюсь в виде соединений. Я играю огромную роль в повседневной жизни!`;

  useEffect(() => {
    let i = 0;
    setDisplayedStory('');
    setEmotion('speaking');
    setSelectedOption(null);
    setHint(null);
    setShowExplanation(false);
    setRecommendation(null);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.lang = 'ru-RU';
      utterance.rate = 1.0;

      utterance.onend = () => {
        setEmotion('happy');
      };

      window.speechSynthesis.speak(utterance);
    }

    const timer = setInterval(() => {
      setDisplayedStory((prev) => prev + story.charAt(i));
      i++;
      if (i >= story.length) {
        clearInterval(timer);
      }
    }, 40);

    return () => {
      clearInterval(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [element.name, story]);

  const currentQuestion = questions[currentQuestionIndex];

  const mockQuestion = `Сколько электронов находится на моей внешней оболочке, если я нахожусь в ${element.group} группе?`;
  const mockCorrect = element.group > 10 ? element.group - 10 : element.group;
  const mockOptions = [
    mockCorrect.toString(),
    (mockCorrect + 1).toString(),
    (mockCorrect - 1 === 0 ? 8 : mockCorrect - 1).toString()
  ].sort(() => Math.random() - 0.5);

  const displayQuestion = currentQuestion || {
    id: 0,
    text: mockQuestion,
    correctAnswer: mockCorrect.toString(),
    difficulty: 1,
    options: mockOptions,
    explanation: `Номер группы (${element.group}) подсказывает количество валентных электронов. Для главных подгрупп: ${element.group} - 10 = ${mockCorrect}.`
  };

  const handleSelect = async (option: string) => {
    if (selectedOption === displayQuestion.correctAnswer) return;

    setSelectedOption(option);

    if (option === displayQuestion.correctAnswer) {
      setEmotion('happy');
      setHint("Отлично! Ты совершенно прав!");
      setShowExplanation(true);
      setCorrectCount(prev => prev + 1);

      trackEvent({
        userId,
        actionType: 'ANSWER_CORRECT',
        elementId: element.atomicNum,
        questionId: displayQuestion.id,
        userAnswer: option,
      });

      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wasCorrect: true, elementId: element.atomicNum }),
      }).then(res => res.json()).then(data => {
        if (data?.adaptiveResult) {
          const rec = getRecommendedNextElement(element.atomicNum, true);
          if (rec) setRecommendation(rec);
        }
        if (data?.newAchievements && data.newAchievements.length > 0) {
          setAchievementQueue(prev => [...prev, ...data.newAchievements]);
        }
      }).catch(() => {});
    } else {
      setIsLoadingHint(true);
      setEmotion('thinking');
      setHint(null);
      setShowExplanation(true);

      trackEvent({
        userId,
        actionType: 'ANSWER_INCORRECT',
        elementId: element.atomicNum,
        questionId: displayQuestion.id,
        userAnswer: option,
      });

      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wasCorrect: false, elementId: element.atomicNum }),
      }).catch(() => {});

      try {
        const response = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            element,
            question: displayQuestion.text,
            incorrectAnswer: option,
            correctAnswer: displayQuestion.correctAnswer,
            difficulty: displayQuestion.difficulty,
            consecutiveIncorrect: 1,
          })
        });

        if (!response.ok) {
          throw new Error('Network error');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiText = '';

        if (reader) {
          setHint("");
          setEmotion('speaking');
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const textChunk = chunk.split('\\n').join('\n')
              .replace(/0:"/g, '')
              .replace(/"/g, '')
              .replace(/\n\s*\n/g, '\n');

            aiText += textChunk;
            setHint(prev => prev + textChunk);
          }
        }

        trackEvent({
          userId,
          actionType: 'HINT_REQUESTED',
          elementId: element.atomicNum,
          questionId: displayQuestion.id,
          userAnswer: option,
          aiHint: aiText,
        });
      } catch (error) {
        console.error(error);
        setEmotion('speaking');
        setHint(`Подсказка: ${displayQuestion.explanation || 'Попробуй ещё раз!'}`);
      } finally {
        setIsLoadingHint(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHint(null);
      setShowExplanation(false);
      setEmotion('speaking');
    }
  };

  const handleNavigateToElement = () => {
    if (recommendation && onNavigate) {
      onNavigate(recommendation.element);
    }
  };

  const prevElement = getAdjacentElement(element.atomicNum, 'prev');
  const nextElement = getAdjacentElement(element.atomicNum, 'next');

  const handlePrevElement = () => {
    if (prevElement && onNavigate) onNavigate(prevElement);
  };

  const handleNextElement = () => {
    if (nextElement && onNavigate) onNavigate(nextElement);
  };

  const dismissAchievement = () => {
    setAchievementQueue(prev => prev.slice(1));
  };

  const difficultyLabel = (d: number) => {
    if (d === 1) return 'Лёгкий';
    if (d === 2) return 'Средний';
    return 'Сложный';
  };

  const progressPercent = questions.length > 0
    ? ((currentQuestionIndex + (selectedOption === displayQuestion.correctAnswer ? 1 : 0)) / questions.length) * 100
    : 0;

  const allQuestionsCompleted = selectedOption === displayQuestion.correctAnswer &&
    questions.length > 0 &&
    currentQuestionIndex === questions.length - 1;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.navButtons}>
            <button
              className={`${styles.navButton} ${!prevElement ? styles.navButtonDisabled : ''}`}
              onClick={handlePrevElement}
              disabled={!prevElement}
              aria-label="Предыдущий элемент"
            >
              ←
            </button>
          </div>
          <div className={styles.titles}>
            <h2>Знакомство: {element.name}</h2>
            <p>Атомный номер: {element.atomicNum} • Молярная масса: {element.atomicMass}</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.navButton} ${!nextElement ? styles.navButtonDisabled : ''}`}
              onClick={handleNextElement}
              disabled={!nextElement}
              aria-label="Следующий элемент"
            >
              →
            </button>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.storySection}>
            <Mascot element={element} emotion={emotion} />
            <div className={styles.chatBubble}>
              {displayedStory}
              {elementData?.applications && (
                <>
                  <br /><br />
                  <strong>Применение:</strong> {elementData.applications}
                </>
              )}
            </div>
          </div>

          <div className={styles.testSection}>
            <div className={styles.testHeader}>
              <h3>Проверка знаний</h3>
              {questions.length > 0 && (
                <span className={styles.questionCounter}>
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              )}
            </div>

            {questions.length > 0 && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            <div className={styles.questionMeta}>
              <span className={`${styles.difficultyBadge} ${styles[`difficulty${displayQuestion.difficulty}`]}`}>
                {difficultyLabel(displayQuestion.difficulty)}
              </span>
            </div>

            <p className={styles.questionText}>{displayQuestion.text}</p>

            <div className={styles.testOptions}>
              {displayQuestion.options.map((option, idx) => {
                let btnStyle = {};
                if (selectedOption === option) {
                  btnStyle = option === displayQuestion.correctAnswer
                    ? { backgroundColor: '#e8f5e9', borderColor: '#4caf50', color: '#2e7d32' }
                    : { backgroundColor: '#ffebee', borderColor: '#ef5350', color: '#c62828' };
                } else if (selectedOption && option === displayQuestion.correctAnswer) {
                  btnStyle = { borderColor: '#4caf50', color: '#2e7d32' };
                }

                return (
                  <button
                    key={idx}
                    className={styles.optionButton}
                    onClick={() => handleSelect(option)}
                    style={btnStyle}
                    disabled={selectedOption === displayQuestion.correctAnswer}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showExplanation && displayQuestion.explanation && selectedOption !== displayQuestion.correctAnswer && (
              <div className={styles.explanation}>
                <strong>Объяснение:</strong> {displayQuestion.explanation}
              </div>
            )}

            {isLoadingHint && (
              <div className={styles.aiHint}>
                <span className={styles.aiIcon}>🤖</span>
                <p>Ваш атом обдумывает подсказку...</p>
              </div>
            )}

            {!isLoadingHint && hint && (
              <div className={styles.aiHint}>
                <span className={styles.aiIcon}>💡</span>
                <p>{hint}</p>
              </div>
            )}

            {!allQuestionsCompleted && selectedOption === displayQuestion.correctAnswer && questions.length > 0 && currentQuestionIndex < questions.length - 1 && (
              <button className={styles.nextButton} onClick={handleNextQuestion}>
                Следующий вопрос →
              </button>
            )}

            {allQuestionsCompleted && (
              <div className={styles.completed}>
                <p>Ты ответил правильно на {correctCount + 1} из {questions.length} вопросов!</p>
              </div>
            )}

            {recommendation && (
              <div className={styles.recommendation}>
                <p className={styles.recommendationText}>{recommendation.reason}</p>
                <button className={styles.nextElementButton} onClick={handleNavigateToElement}>
                  Изучить {recommendation.element.name} ({recommendation.element.symbol}) →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {achievementQueue.length > 0 && (
        <AchievementToast
          name={achievementQueue[0].name}
          description={achievementQueue[0].description}
          icon={achievementQueue[0].icon}
          onDismiss={dismissAchievement}
        />
      )}
    </div>
  );
}
