import { useState, useEffect, useCallback } from 'react';
import { getStudentIdFromToken, isAuthenticated } from '../api/auth';
import {
  closeSession,
  createSession,
  getSession,
  updateSessionLevel,
} from '../api/sessions';
import { ApiError } from '../api/tutorbot';
import type { Level, SessionData, Topic } from '../types';

const STORAGE_KEY = 'tutorbot-session';
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function defaultSession(): SessionData {
  return {
    sessionId: '',
    studentId: '',
    topic: '',
    topicId: null,
    topicLabel: '',
    level: 'beginner',
    streak: 0,
    lastActiveDate: '',
    sessionsCompleted: 0,
    quizAccuracy: 0,
    totalQuizzes: 0,
    correctQuizzes: 0,
    evaluationCount: 0,
    topicStats: {},
    examResults: [],
    examSummary: null,
    recommendedTopics: [],
  };
}

function withActivity(session: SessionData): SessionData {
  const today = getToday();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let streak = session.streak;
  if (session.lastActiveDate === yesterdayStr) {
    streak += 1;
  } else if (session.lastActiveDate !== today) {
    streak = 1;
  }

  return {
    ...session,
    streak,
    lastActiveDate: today,
    sessionsCompleted: session.sessionsCompleted + 1,
  };
}

export function useSession() {
  const [session, setSession] = useState<SessionData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as SessionData;
      }
    } catch { /* ignore */ }
    return {
      ...defaultSession(),
      studentId: getStudentIdFromToken(),
    };
  });
  const [lastInteractionAt, setLastInteractionAt] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    let cancelled = false;

    const verifyStoredSession = async () => {
      if (!isAuthenticated() || !session.sessionId) return;

      try {
        const remote = await getSession(session.sessionId);
        if (!cancelled) {
          setSession((prev) => ({
            ...prev,
            studentId: getStudentIdFromToken(),
            sessionId: remote.sessionId || prev.sessionId,
            topicId: remote.topicId ?? prev.topicId,
            topicLabel: remote.topicLabel || prev.topicLabel,
            level: remote.level || prev.level,
            examResults: remote.examResults || prev.examResults || [],
            examSummary: remote.examSummary || prev.examSummary || null,
            recommendedTopics: remote.recommendedTopics || prev.recommendedTopics || [],
          }));
        }
      } catch (error) {
        if (
          !cancelled &&
          error instanceof ApiError &&
          error.status === 404 &&
          session.topicId !== null &&
          session.topic &&
          session.topicLabel
        ) {
          try {
            const recreated = await createSession(
              {
                id: session.topic,
                topicId: session.topicId,
                label: session.topicLabel,
                icon: '📘',
                description: '',
              },
              session.level
            );

            if (!cancelled) {
              setSession((prev) => ({ ...prev, ...recreated }));
            }
          } catch {
            if (!cancelled) {
              setSession((prev) => ({
                ...prev,
                sessionId: '',
              }));
            }
          }
        }
      }
    };

    void verifyStoredSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session.sessionId) return;

    const events: Array<keyof WindowEventMap> = [
      'click',
      'keydown',
      'mousemove',
      'scroll',
      'touchstart',
    ];
    const handleActivity = () => setLastInteractionAt(Date.now());

    events.forEach((eventName) =>
      window.addEventListener(eventName, handleActivity, { passive: true })
    );

    return () => {
      events.forEach((eventName) =>
        window.removeEventListener(eventName, handleActivity)
      );
    };
  }, [session.sessionId]);

  useEffect(() => {
    if (!session.sessionId) return;

    const timeoutId = window.setTimeout(() => {
      void closeSession(session.sessionId).catch(() => undefined);
      setSession((prev) => ({ ...prev, sessionId: '' }));
    }, IDLE_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [session.sessionId, lastInteractionAt]);

  useEffect(() => {
    if (!session.sessionId) return;

    const handleBeforeUnload = () => {
      void closeSession(session.sessionId).catch(() => undefined);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session.sessionId]);

  const setTopic = useCallback((topic: Topic) => {
    setSession((prev) => ({
      ...prev,
      topic: topic.id,
      topicId: topic.topicId,
      topicLabel: topic.label,
    }));
  }, []);

  const setLevel = useCallback((level: Level) => {
    setSession((prev) => ({ ...prev, level }));
    if (session.sessionId) {
      void updateSessionLevel(session.sessionId, level).catch(() => undefined);
    }
  }, [session.sessionId]);

  const startSession = useCallback(
    async (topic: Topic) => {
      const created = await createSession(topic, session.level);
      setSession((prev) =>
        withActivity({
          ...prev,
          ...created,
          studentId: created.studentId || getStudentIdFromToken(),
        })
      );
      setLastInteractionAt(Date.now());
    },
    [session.level]
  );

  const recordEvaluation = useCallback(() => {
    let nextCount = 0;

    setSession((prev) => {
      nextCount = prev.evaluationCount + 1;
      return {
        ...prev,
        evaluationCount: nextCount,
      };
    });

    return nextCount;
  }, []);

  const recordQuiz = useCallback((correct: boolean, topic: string) => {
    setSession((prev) => {
      const topicStats = { ...prev.topicStats };
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0 };
      }
      topicStats[topic].total += 1;
      if (correct) topicStats[topic].correct += 1;

      const totalQuizzes = prev.totalQuizzes + 1;
      const correctQuizzes = prev.correctQuizzes + (correct ? 1 : 0);

      return {
        ...prev,
        totalQuizzes,
        correctQuizzes,
        quizAccuracy: Math.round((correctQuizzes / totalQuizzes) * 100),
        topicStats,
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    if (session.sessionId) {
      void closeSession(session.sessionId).catch(() => undefined);
    }
    setSession(defaultSession());
    localStorage.removeItem(STORAGE_KEY);
  }, [session.sessionId]);

  return {
    session,
    setTopic,
    setLevel,
    startSession,
    recordEvaluation,
    recordQuiz,
    resetSession,
  };
}
