'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ChemicalElement } from '../lib/elements';
import styles from './StoryModal.module.css';
import StoryNarration from './StoryNarration';
import QuizSection from './QuizSection';
import AiHintPanel from './AiHintPanel';
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [recommendation, setRecommendation] = useState<{ element: ChemicalElement; reason: string } | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Array<{ code: string; name: string; description: string; icon: string }>>([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ═══ Body scroll lock + focus management ═══
  useEffect(() => {
    document.body.classList.add('modal-open');
    closeButtonRef.current?.focus();
    return () => { document.body.classList.remove('modal-open'); };
  }, []);

  // ═══ Escape key ═══
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ═══ Focus trap ═══
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  // ═══ Init user ID + track view ═══
  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
    trackEvent({ userId: id, actionType: 'ELEMENT_VIEWED', elementId: element.atomicNum });
  }, [element.atomicNum]);

  // ═══ Fetch element data ═══
  useEffect(() => {
    const fetchElementData = async () => {
      setIsLoadingData(true);
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
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchElementData();
  }, [element.atomicNum]);

   // ═══ Story text ═══
   const story = useMemo(
     () => elementData?.description || `Привет! Я — ${element.name}, живой атом! Мой номер в таблице — ${element.atomicNum}. В чистом виде я могу быть очень активным, но в природе чаще встречаюсь в виде соединений. Я играю огромную роль в повседневной жизни!`,
     [elementData?.description, element.name, element.atomicNum]
   );

  // ═══ Typewriter + TTS ═══
  useEffect(() => {
    if (isLoadingData) {
      setDisplayedStory('');
      return;
    }

    let charIndex = 0;
    let cancelled = false;
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
      utterance.onend = () => setEmotion('happy');
      window.speechSynthesis.speak(utterance);
    }

    const timer = setInterval(() => {
      if (cancelled) { clearInterval(timer); return; }
      charIndex++;
      setDisplayedStory(story.substring(0, charIndex));
      if (charIndex >= story.length) clearInterval(timer);
    }, 40);

    return () => {
      cancelled = true;
      clearInterval(timer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [story, isLoadingData]);

  // ═══ Quiz state ═══
  const currentQuestion = questions[currentQuestionIndex];
  const mockCorrect = element.group > 10 ? element.group - 10 : (element.group || 1);
  const mockOptions = useMemo(() => [
    mockCorrect.toString(),
    (mockCorrect + 1).toString(),
    (mockCorrect - 1 === 0 ? 8 : mockCorrect - 1).toString()
  ].sort(() => Math.random() - 0.5), [mockCorrect]);

  const displayQuestion = currentQuestion || {
    id: 0,
    text: `Сколько электронов находится на моей внешней оболочке, если я нахожусь в ${element.group || 'особой'} группе?`,
    correctAnswer: mockCorrect.toString(),
    difficulty: 1,
    options: mockOptions,
    explanation: `Номер группы подсказывает количество валентных электронов.`
  };

  const allQuestionsCompleted = selectedOption === displayQuestion.correctAnswer &&
    questions.length > 0 && currentQuestionIndex === questions.length - 1;

  // ═══ Answer handler ═══
  const handleSelect = async (option: string) => {
    if (selectedOption === displayQuestion.correctAnswer) return;
    setSelectedOption(option);

    if (option === displayQuestion.correctAnswer) {
      setEmotion('happy');
      setHint("Отлично! Ты совершенно прав!");
      setShowExplanation(true);
      setCorrectCount(prev => prev + 1);

      trackEvent({ userId, actionType: 'ANSWER_CORRECT', elementId: element.atomicNum, questionId: displayQuestion.id, userAnswer: option });

      fetch('/api/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wasCorrect: true, elementId: element.atomicNum }),
      }).then(res => res.json()).then(data => {
        if (data?.adaptiveResult) {
          const rec = getRecommendedNextElement(element.atomicNum, true);
          if (rec) setRecommendation(rec);
        }
        if (data?.newAchievements?.length > 0) {
          setAchievementQueue(prev => [...prev, ...data.newAchievements]);
        }
      }).catch(() => {});
    } else {
      setIsLoadingHint(true);
      setEmotion('thinking');
      setHint(null);
      setShowExplanation(true);

      trackEvent({ userId, actionType: 'ANSWER_INCORRECT', elementId: element.atomicNum, questionId: displayQuestion.id, userAnswer: option });

      fetch('/api/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wasCorrect: false, elementId: element.atomicNum }),
      }).catch(() => {});

      try {
        const response = await fetch('/api/ai-tutor', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            element, question: displayQuestion.text,
            incorrectAnswer: option, correctAnswer: displayQuestion.correctAnswer,
            difficulty: displayQuestion.difficulty, consecutiveIncorrect: 1,
          })
        });

        if (!response.ok) throw new Error('Network error');
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiText = '';

        if (reader) {
          setHint("");
          setEmotion('speaking');
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const textChunk = chunk
              .replace(/data:\s*/g, '')
              .split('\\n').join('\n')
              .replace(/0:"/g, '')
              // Be more careful with quote removal - only remove quotes that are clearly wrappers
              .replace(/^"(.*)"$/, '$1')
              .replace(/"\s*$/gm, '')
              .replace(/\n\s*\n/g, '\n');
            if (textChunk.trim()) {
              aiText += textChunk;
              setHint(prev => prev + textChunk);
            }
          }
        }

        trackEvent({ userId, actionType: 'HINT_REQUESTED', elementId: element.atomicNum, questionId: displayQuestion.id, userAnswer: option, aiHint: aiText });
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

  const prevElement = getAdjacentElement(element.atomicNum, 'prev');
  const nextElement = getAdjacentElement(element.atomicNum, 'next');

  const dismissAchievement = useCallback(() => {
    setAchievementQueue(prev => prev.slice(1));
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* ═══ Header ═══ */}
        <div className={styles.header}>
          <div className={styles.navButtons}>
            <button
              className={`${styles.navButton} ${!prevElement ? styles.navButtonDisabled : ''}`}
              onClick={() => prevElement && onNavigate?.(prevElement)}
              disabled={!prevElement}
              aria-label="Предыдущий элемент"
            >←</button>
          </div>
          <div className={styles.titles}>
            <h2 id="modal-title">Знакомство: {element.name}</h2>
            <p>Атомный номер: {element.atomicNum} • {element.symbol} • Масса: {element.atomicMass}</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.navButton} ${!nextElement ? styles.navButtonDisabled : ''}`}
              onClick={() => nextElement && onNavigate?.(nextElement)}
              disabled={!nextElement}
              aria-label="Следующий элемент"
            >→</button>
            <button ref={closeButtonRef} className={styles.closeButton} onClick={onClose} aria-label="Закрыть">×</button>
          </div>
        </div>

        {/* ═══ Content ═══ */}
        <div className={styles.content}>
          <StoryNarration
            element={element}
            emotion={emotion}
            displayedStory={displayedStory}
            applications={elementData?.applications}
          />

          <QuizSection
            question={displayQuestion}
            selectedOption={selectedOption}
            showExplanation={showExplanation}
            questionsTotal={questions.length}
            currentIndex={currentQuestionIndex}
            correctCount={correctCount}
            allCompleted={allQuestionsCompleted}
            onSelect={handleSelect}
            onNext={handleNextQuestion}
            hasNextQuestion={currentQuestionIndex < questions.length - 1}
          />

          <AiHintPanel hint={hint} isLoading={isLoadingHint} />

          {recommendation && (
            <div className={styles.recommendation}>
              <p className={styles.recommendationText}>{recommendation.reason}</p>
              <button
                className={styles.nextElementButton}
                onClick={() => recommendation && onNavigate?.(recommendation.element)}
              >
                Изучить {recommendation.element.name} ({recommendation.element.symbol}) →
              </button>
            </div>
          )}
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
