import type { GapAlert, LeaderboardEntry, Level, QuizBlock, Topic } from '../types';
import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const USE_BACKEND_QUIZ = import.meta.env.VITE_USE_BACKEND_QUIZ === 'true';

const TOPIC_ICONS: Record<string, string> = {
  math: '🔢',
  mathematics: '🔢',
  science: '🔬',
  coding: '💻',
  programming: '💻',
  history: '📜',
  english: '📝',
  languages: '🌍',
};

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function resolveTopicIcon(label: string) {
  const key = label.trim().toLowerCase();
  return TOPIC_ICONS[key] || '📘';
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }

  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (!headers.has('Authorization') && token && path !== '/api/v1/auth/login') {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('jwt');
    localStorage.removeItem('tutorbot-session');
    window.location.href = '/login';
  }

  return res;
}

export async function readJson<T>(res: Response): Promise<T> {
  const body = await parseResponseBody(res);

  if (!res.ok) {
    const message =
      typeof body === 'object' && body !== null && 'message' in body && typeof (body as { message?: unknown }).message === 'string'
        ? (body as { message: string }).message
        : `Request failed with status ${res.status}.`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

type BackendTopic = {
  id?: number;
  topicId?: number;
  name?: string;
  label?: string;
  description?: string;
};

export async function fetchTopics(): Promise<Topic[]> {
  const res = await apiFetch('/api/v1/topics');
  const payload = await readJson<BackendTopic[]>(res);

  return payload.map((topic) => {
    const label = topic.label || topic.name || 'Topic';
    const topicId = topic.topicId ?? topic.id ?? 0;
    return {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      topicId,
      label,
      icon: resolveTopicIcon(label),
      description: topic.description || `Study ${label} with TutorBot.`,
    };
  });
}

export type EvaluationRequest = {
  sessionId: string;
  studentId: string;
  topicId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string | null;
  maxScore: number;
  skillLevel: Level;
};

export type EvaluationResponse = {
  id: string | number;
  sessionId: string;
  studentId: string;
  score: number;
  feedback: string;
  feedbackSummary?: string;
  evaluatedAt: string;
};

export async function submitEvaluation(payload: EvaluationRequest): Promise<EvaluationResponse> {
  const res = await apiFetch('/api/v1/evaluations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const evaluation = await readJson<EvaluationResponse>(res);
  return {
    ...evaluation,
    feedback: evaluation.feedback || evaluation.feedbackSummary || 'TutorBot could not generate feedback.',
  };
}

type GenerateQuizRequest = {
  sessionId: string;
  topicId: number;
  studentId: string;
};

type BackendQuizResponse = {
  question?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
};

export async function generateQuiz(payload: GenerateQuizRequest): Promise<QuizBlock | null> {
  if (!USE_BACKEND_QUIZ) {
    return null;
  }

  const res = await apiFetch('/api/v1/exercises/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const quiz = await readJson<BackendQuizResponse>(res);
  if (!quiz.question || !Array.isArray(quiz.options) || typeof quiz.correct !== 'number') {
    throw new ApiError('Quiz payload is invalid.', 500, quiz);
  }

  return {
    question: quiz.question,
    options: quiz.options,
    correct: quiz.correct,
    explanation: quiz.explanation || '',
  };
}

export async function getLatestGap(studentId: string): Promise<GapAlert | null> {
  const res = await apiFetch(`/api/v1/gaps/student/${studentId}/latest`);
  if (res.status === 404) {
    return null;
  }

  const payload = await readJson<Record<string, unknown>>(res);
  return {
    id: typeof payload.id === 'string' ? payload.id : undefined,
    topicId: typeof payload.topicId === 'number' ? payload.topicId : undefined,
    severity: typeof payload.severity === 'number' ? payload.severity : 0,
    message:
      typeof payload.message === 'string'
        ? payload.message
        : 'TutorBot detected a learning gap that may need extra practice.',
    detectedAt: typeof payload.detectedAt === 'string' ? payload.detectedAt : undefined,
  };
}

export async function getLeaderboard(topicId: number): Promise<LeaderboardEntry[]> {
  const res = await apiFetch(`/api/v1/gaps/leaderboard?topicId=${topicId}`);
  const payload = await readJson<Record<string, unknown>[]>(res);

  return payload.map((entry, index) => ({
    studentId:
      typeof entry.studentId === 'string' ? entry.studentId : `Student ${index + 1}`,
    score: typeof entry.score === 'number' ? entry.score : 0,
    rank: typeof entry.rank === 'number' ? entry.rank : index + 1,
  }));
}
