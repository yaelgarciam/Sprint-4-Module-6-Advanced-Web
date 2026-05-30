import { useMemo } from 'react';
import type { Message, QuizBlock } from '../types';
import { parseQuiz } from '../utils/parseQuiz';

export function useQuizParser(messages: Message[]): (QuizBlock & { messageId: string }) | null {
  return useMemo(() => {
    // Find the latest message with a quiz
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.quiz) {
        return { ...msg.quiz, messageId: msg.id };
      }
      if (msg.role === 'assistant' && !msg.isStreaming) {
        const quiz = parseQuiz(msg.content);
        if (quiz) return { ...quiz, messageId: msg.id };
      }
    }
    return null;
  }, [messages]);
}
