'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AIChat.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! Я — AI-репетитор по химии. Могу ответить на любые вопросы о таблице Менделеева, химических элементах, реакциях и многом другом. Спрашивай!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] })
      });

      if (!response.ok) throw new Error('Network error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
           const textChunk = chunk
             .replace(/data:\s*/g, '')
             // Be more careful with quote removal - only remove quotes that are clearly wrappers
             .replace(/^"(.*)"$/, '$1')
             .replace(/"\s*$/gm, '');
          if (textChunk.trim()) {
            assistantMessage += textChunk;
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMessage };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Извини, произошла ошибка. Попробуй задать вопрос ещё раз!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setIsOpen(!isOpen)} aria-label="Открыть чат с ИИ">
        💬
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>AI-репетитор по химии</span>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>✕</button>
          </div>
          
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant} ${styles.loading}`}>
                <span className={styles.dots}>Печатает<span>.</span><span>.</span><span>.</span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спроси о химии..."
              rows={1}
              className={styles.input}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className={styles.sendBtn}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}