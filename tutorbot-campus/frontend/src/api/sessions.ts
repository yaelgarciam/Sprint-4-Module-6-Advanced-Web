import type { ExamResult, ExamSummary, Level, Message, StudyRecommendation, Topic } from '../types';
import { apiFetch, readJson } from './tutorbot';
import { getStudentIdFromToken } from './auth';

type CreateSessionResponse = {
  sessionId?: string;
  id?: string;
  topicId?: number;
  topicName?: string;
  skillLevel?: Level;
};

type SessionResponse = {
  sessionId?: string;
  id?: string;
  status?: string;
  topicId?: number;
  topicName?: string;
  skillLevel?: Level;
  examResults?: ExamResult[];
  examSummary?: ExamSummary;
  recommendedTopics?: StudyRecommendation[];
};

type SessionMessagePayload = {
  id?: string;
  sessionId?: string;
  role?: 'user' | 'assistant';
  content?: string;
  timestamp?: number | string;
  score?: number;
};

export async function createSession(topic: Topic, level: Level) {
  const studentId = getStudentIdFromToken();
  const res = await apiFetch('/api/v1/sessions', {
    method: 'POST',
    body: JSON.stringify({
      studentId,
      topicId: topic.topicId,
      skillLevel: level,
    }),
  });

  const payload = await readJson<CreateSessionResponse>(res);
  return {
    sessionId: payload.sessionId || payload.id || '',
    studentId,
    topicId: payload.topicId ?? topic.topicId,
    topic: topic.id,
    topicLabel: payload.topicName || topic.label,
    level: payload.skillLevel || level,
  };
}

export async function getSession(sessionId: string) {
  const res = await apiFetch(`/api/v1/sessions/${sessionId}`);
  const payload = await readJson<SessionResponse>(res);
  return {
    sessionId: payload.sessionId || payload.id || sessionId,
    status: payload.status || 'ACTIVE',
    topicId: payload.topicId,
    topicLabel: payload.topicName,
    level: payload.skillLevel,
    examResults: payload.examResults || [],
    examSummary: payload.examSummary || null,
    recommendedTopics: payload.recommendedTopics || [],
  };
}

export async function closeSession(sessionId: string) {
  const res = await apiFetch(`/api/v1/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function updateSessionLevel(sessionId: string, level: Level) {
  const res = await apiFetch(`/api/v1/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ skillLevel: level }),
  });
  return readJson<Record<string, unknown>>(res);
}

type ExamSnapshotPayload = {
  examResults: ExamResult[];
  examSummary: ExamSummary;
  recommendedTopics: StudyRecommendation[];
};

export async function updateSessionExam(sessionId: string, payload: ExamSnapshotPayload) {
  const res = await apiFetch(`/api/v1/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const res = await apiFetch(`/api/v1/sessions/${sessionId}/messages`);
  const payload = await readJson<SessionMessagePayload[]>(res);

  return payload.map((message) => ({
    id: message.id || crypto.randomUUID(),
    sessionId: message.sessionId || sessionId,
    role: message.role || 'assistant',
    content: message.content || '',
    timestamp:
      typeof message.timestamp === 'number'
        ? message.timestamp
        : Date.parse(String(message.timestamp || Date.now())),
    score: typeof message.score === 'number' ? message.score : undefined,
  }));
}

export async function postMessage(sessionId: string, message: Message) {
  const res = await apiFetch(`/api/v1/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify(message),
  });
  return readJson<Record<string, unknown>>(res);
}
