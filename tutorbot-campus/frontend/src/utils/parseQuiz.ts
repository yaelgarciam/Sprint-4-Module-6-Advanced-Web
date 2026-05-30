import type { QuizBlock } from '../types';

export function parseQuiz(text: string): QuizBlock | null {
  try {
    const match = text.match(/\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/);
    if (!match) return null;

    const raw = JSON.parse(match[1]);

    if (
      !raw.question ||
      !Array.isArray(raw.options) ||
      raw.options.length < 2 ||
      typeof raw.correct !== 'number'
    ) {
      return null;
    }

    return raw as QuizBlock;
  } catch {
    return null;
  }
}

export function isQuizComplete(buffer: string): boolean {
  return buffer.includes('[/QUIZ]');
}

export function stripQuizBlock(text: string): string {
  return text.replace(/\[QUIZ\][\s\S]*?\[\/QUIZ\]/, '').trim();
}
