import type { Level, QuizBlock } from '../types';
import { parseQuiz } from '../utils/parseQuiz';

function buildQuizPrompt(topic: string, level: Level): string {
  return `You are TutorBot. Generate exactly one multiple choice quiz for ${topic} at ${level} level.

Return only this format:
[QUIZ]{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}[/QUIZ]`;
}

export async function generateQuizWithClaudeFallback(
  topic: string,
  level: Level
): Promise<QuizBlock | null> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing VITE_ANTHROPIC_API_KEY for quiz fallback. Create a .env file in frontend/ and restart Vite.'
    );
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: buildQuizPrompt(topic, level),
      messages: [
        {
          role: 'user',
          content: `Create a four-option quiz for ${topic}.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic quiz fallback failed with status ${res.status}.`);
  }

  const payload = await res.json();
  const text = Array.isArray(payload?.content)
    ? payload.content
        .map((block: { type?: string; text?: string }) =>
          block.type === 'text' ? block.text || '' : ''
        )
        .join('')
    : '';

  return parseQuiz(text);
}
