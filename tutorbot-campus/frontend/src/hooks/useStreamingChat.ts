import { useState, useCallback, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { closeSession, updateSessionExam } from '../api/sessions';
import { getLatestGap } from '../api/gaps';
import { postMessage, getMessages } from '../api/sessions';
import { submitEvaluation } from '../api/tutorbot';
import type { GapAlert, Message, QuizBlock, SessionData } from '../types';
import { stripQuizBlock } from '../utils/parseQuiz';
import {
  buildExamSnapshot,
  buildExamSummary,
  COMPLETION_MARKER,
  QUESTION_HEADER,
  TOTAL_EXAM_QUESTIONS,
} from '../utils/examResults';

function getUserFacingError(error: unknown): string {
  if (error instanceof Error && /failed to fetch/i.test(error.message)) {
    return '⚠️ TutorBot is temporarily unavailable.';
  }

  if (error instanceof Error && error.message.trim()) {
    return `⚠️ ${error.message}`;
  }

  return '⚠️ Something went wrong. Tap to retry.';
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getLastTutorPrompt(messages: Message[], topicLabel: string) {
  const lastAssistant = [...messages]
    .reverse()
    .find(
      (message) =>
        message.role === 'assistant' &&
        !message.isError &&
        !isCompletionMessage(message) &&
        !message.quiz
    );

  return stripQuizBlock(lastAssistant?.content || `Let's practice ${topicLabel}.`);
}

function hasTutorPrompt(messages: Message[]) {
  return messages.some((message) => message.role === 'assistant' && !message.isError);
}

type ExamQuestion = {
  prompt: string;
};

function normalizeTopicLabel(topicLabel: string) {
  return topicLabel.trim().toLowerCase();
}

function getQuestionBank(topicLabel: string, level: SessionData['level']): ExamQuestion[] {
  const normalized = normalizeTopicLabel(topicLabel);

  if (normalized.includes('html') || normalized.includes('css')) {
    return [
      { prompt: 'Explain what semantic HTML is and mention two semantic tags you would use on a basic page.' },
      { prompt: 'What is the difference between a class and an id in CSS, and when would you use each one?' },
      { prompt: 'Describe the box model and explain how margin, border, padding, and content interact.' },
      { prompt: 'Why is responsive design important, and how do media queries help achieve it?' },
      { prompt: 'Give one example of how good HTML structure improves accessibility for users.' },
    ];
  }

  if (normalized.includes('javascript')) {
    return [
      { prompt: 'Explain the difference between let, const, and var in JavaScript.' },
      { prompt: 'What is a callback function, and where is it commonly used?' },
      { prompt: 'Describe what a Promise is and what problem it solves.' },
      { prompt: 'Explain the difference between == and === in JavaScript.' },
      { prompt: 'What is the DOM, and how can JavaScript interact with it?' },
    ];
  }

  if (normalized.includes('spring boot')) {
    return [
      { prompt: 'What problem does Spring Boot solve compared to configuring a Java web application manually?' },
      { prompt: 'Explain what a REST controller is in Spring Boot and what it usually returns.' },
      { prompt: 'What is dependency injection, and why is it useful in Spring applications?' },
      { prompt: 'Describe the role of application.properties in a Spring Boot project.' },
      { prompt: 'How does Spring Data JPA help when working with a relational database?' },
    ];
  }

  return [
    { prompt: `Question 1 for ${topicLabel}: explain one foundational concept of this topic in your own words.` },
    { prompt: `Question 2 for ${topicLabel}: describe a common use case or practical application.` },
    { prompt: `Question 3 for ${topicLabel}: mention one mistake beginners often make and how to avoid it.` },
    { prompt: `Question 4 for ${topicLabel}: explain one tool, pattern, or technique commonly used in this topic.` },
    { prompt: `Question 5 for ${topicLabel}: summarize why this topic matters in a real project.` },
  ].map((question) => ({
    prompt: level === 'advanced'
      ? `${question.prompt} Include technical detail and tradeoffs.`
      : level === 'intermediate'
        ? `${question.prompt} Include a concrete example.`
        : question.prompt,
  }));
}

function buildQuestionContent(questionNumber: number, totalQuestions: number, prompt: string) {
  return `Question ${questionNumber} of ${totalQuestions}\n${prompt}`;
}

function buildStarterPrompt(topicLabel: string, level: SessionData['level']) {
  const firstQuestion = getQuestionBank(topicLabel, level)[0];
  return buildQuestionContent(1, TOTAL_EXAM_QUESTIONS, firstQuestion.prompt);
}

function getQuestionMessages(messages: Message[]) {
  return messages.filter(
    (message) =>
      message.role === 'assistant' &&
      !message.isError &&
      QUESTION_HEADER.test(stripQuizBlock(message.content))
  );
}

function getLatestQuestionNumber(messages: Message[]) {
  const questionMessages = getQuestionMessages(messages);
  if (questionMessages.length === 0) {
    return 0;
  }

  const lastQuestion = questionMessages[questionMessages.length - 1];
  const match = stripQuizBlock(lastQuestion.content).match(QUESTION_HEADER);
  return match ? Number(match[1]) : 0;
}

function isCompletionMessage(message: Message) {
  return stripQuizBlock(message.content).startsWith(COMPLETION_MARKER);
}

function hasCompletedExam(messages: Message[]) {
  return messages.some((message) => message.role === 'assistant' && isCompletionMessage(message));
}

function buildCompletionMessage(topicLabel: string, scores: number[]) {
  const answered = scores.length;
  const averageScore = answered > 0
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / answered)
    : 0;

  return [
    `${COMPLETION_MARKER} You finished the ${topicLabel} mini-exam.`,
    `Questions answered: ${answered}/${TOTAL_EXAM_QUESTIONS}`,
    `Average score: ${averageScore}/100`,
    'Review the feedback above and start a new session if you want another attempt.',
  ].join('\n');
}

function getEvaluationScores(messages: Message[]) {
  return messages
    .filter((message) => message.role === 'assistant' && typeof message.score === 'number')
    .map((message) => message.score as number);
}

function repairExamHistory(messages: Message[], topicLabel: string, level: SessionData['level']) {
  const scores = getEvaluationScores(messages);
  const answeredQuestions = scores.length;
  let repaired = messages;

  if (answeredQuestions < TOTAL_EXAM_QUESTIONS) {
    repaired = repaired.filter((message) => !isCompletionMessage(message));
    const expectedQuestionNumber = answeredQuestions + 1;
    const latestQuestionNumber = getLatestQuestionNumber(repaired);
    if (latestQuestionNumber !== expectedQuestionNumber) {
      const questionBank = getQuestionBank(topicLabel, level);
      const nextQuestion = questionBank[expectedQuestionNumber - 1];
      if (nextQuestion) {
        repaired = [
          ...repaired,
          {
            id: nanoid(),
            sessionId: repaired[0]?.sessionId || '',
            role: 'assistant',
            content: buildQuestionContent(expectedQuestionNumber, TOTAL_EXAM_QUESTIONS, nextQuestion.prompt),
            timestamp: Date.now(),
          },
        ];
      }
    }
    return repaired;
  }

  if (!hasCompletedExam(repaired)) {
    repaired = [
      ...repaired,
      {
        id: nanoid(),
        sessionId: repaired[0]?.sessionId || '',
        role: 'assistant',
        content: buildCompletionMessage(topicLabel, scores),
        timestamp: Date.now(),
      },
    ];
  }

  return repaired;
}

function tokenizeFeedback(text: string) {
  return text.match(/\S+\s*/g) || [text];
}

type UseStreamingChatOptions = {
  session: SessionData;
  onEvaluationComplete: () => number;
  onQuizGraded: (correct: boolean, topic: string) => void;
};

export function useStreamingChat({
  session,
  onEvaluationComplete,
  onQuizGraded,
}: UseStreamingChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [latestGap, setLatestGap] = useState<GapAlert | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesRef = useRef<Message[]>([]);
  const evaluationScores = getEvaluationScores(messages);
  const answeredQuestions = evaluationScores.length;
  const examCompleted = hasCompletedExam(messages) || answeredQuestions >= TOTAL_EXAM_QUESTIONS;
  const examProgress = examCompleted ? TOTAL_EXAM_QUESTIONS : Math.min(answeredQuestions + 1, TOTAL_EXAM_QUESTIONS);
  const examSummary = buildExamSummary(session.topicLabel || session.topic, evaluationScores, latestGap);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const persistMessage = useCallback(async (message: Message) => {
    if (!message.sessionId) return;
    try {
      await postMessage(message.sessionId, message);
    } catch {
      // Keep local chat usable even if message persistence fails.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      if (!session.sessionId) {
        setMessages([]);
        return;
      }

      setIsLoadingHistory(true);
      try {
        const history = await getMessages(session.sessionId);
        if (!cancelled) {
          if (history.length > 0) {
            setMessages(repairExamHistory(history, session.topicLabel || session.topic, session.level));
          } else {
            const starterMessage: Message = {
              id: nanoid(),
              sessionId: session.sessionId,
              role: 'assistant',
              content: buildStarterPrompt(session.topicLabel || session.topic, session.level),
              timestamp: Date.now(),
            };
            setMessages([starterMessage]);
            void persistMessage(starterMessage);
          }
        }
      } catch {
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [persistMessage, session.level, session.sessionId, session.topic, session.topicLabel]);

  const syncLatestGap = useCallback(async () => {
    if (!session.studentId) {
      setLatestGap(null);
      return null;
    }

    try {
      const gap = await getLatestGap(session.studentId);
      setLatestGap(gap);
      return gap;
    } catch {
      setLatestGap(null);
      return null;
    }
  }, [session.studentId]);

  const persistExamState = useCallback(async (snapshotMessages: Message[], gap: GapAlert | null) => {
    if (!session.sessionId) {
      return;
    }

    const snapshot = buildExamSnapshot(session.topicLabel || session.topic, snapshotMessages, gap);
    if (snapshot.examResults.length === 0) {
      return;
    }

    try {
      await updateSessionExam(session.sessionId, snapshot);
    } catch {
      // Keep the exam flow usable even if structured snapshot persistence fails.
    }
  }, [session.sessionId, session.topic, session.topicLabel]);

  const typeAssistantMessage = useCallback(async (botId: string, fullText: string, score?: number) => {
    const tokens = tokenizeFeedback(fullText);
    let typed = '';

    for (const token of tokens) {
      typed += token;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId
            ? { ...message, content: typed, isStreaming: true }
            : message
        )
      );
      await delay(22);
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === botId
          ? { ...message, content: fullText, isStreaming: false, score }
          : message
      )
    );
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const topicId = session.topicId;
      if (!session.sessionId || topicId === null) return;
      if (hasCompletedExam(messagesRef.current)) return;

      if (!hasTutorPrompt(messagesRef.current)) {
        const starterMessage: Message = {
          id: nanoid(),
          sessionId: session.sessionId,
          role: 'assistant',
          content: buildStarterPrompt(session.topicLabel || session.topic, session.level),
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, starterMessage]);
        void persistMessage(starterMessage);
        return;
      }

      const userMsg: Message = {
        id: nanoid(),
        sessionId: session.sessionId,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      void persistMessage(userMsg);

      const botId = nanoid();
      setMessages((prev) => [
        ...prev,
        {
          id: botId,
          sessionId: session.sessionId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      setIsStreaming(true);

      let retries = 0;

      const attempt = async (): Promise<void> => {
        try {
          const answeredBefore = getEvaluationScores(messagesRef.current).length;
          const currentMessages = [...messagesRef.current, userMsg];
          const evaluation = await submitEvaluation({
            sessionId: session.sessionId,
            studentId: session.studentId,
            topicId,
            questionText: getLastTutorPrompt(messagesRef.current, session.topicLabel || session.topic),
            studentAnswer: text,
            correctAnswer: null,
            maxScore: 100,
            skillLevel: session.level,
          });

          await typeAssistantMessage(botId, evaluation.feedback, evaluation.score);

          const assistantMessage: Message = {
            id: botId,
            sessionId: session.sessionId,
            role: 'assistant',
            content: evaluation.feedback,
            timestamp: Date.parse(evaluation.evaluatedAt) || Date.now(),
            isStreaming: false,
            score: evaluation.score,
          };
          setMessages((prev) =>
            prev.map((message) =>
              message.id === botId
                ? { ...message, ...assistantMessage }
                : message
            )
          );
          void persistMessage(assistantMessage);

          onEvaluationComplete();

          const answeredAfter = answeredBefore + 1;
          const questionBank = getQuestionBank(session.topicLabel || session.topic, session.level);
          let snapshotMessages = [...currentMessages, assistantMessage];

          if (answeredAfter < TOTAL_EXAM_QUESTIONS) {
            const nextQuestion = questionBank[answeredAfter];
            if (nextQuestion) {
              const questionMessage: Message = {
                id: nanoid(),
                sessionId: session.sessionId,
                role: 'assistant',
                content: buildQuestionContent(
                  answeredAfter + 1,
                  TOTAL_EXAM_QUESTIONS,
                  nextQuestion.prompt
                ),
                timestamp: Date.now(),
              };
              setMessages((prev) => [...prev, questionMessage]);
              void persistMessage(questionMessage);
              snapshotMessages = [...snapshotMessages, questionMessage];
            }
          } else {
            const completionMessage: Message = {
              id: nanoid(),
              sessionId: session.sessionId,
              role: 'assistant',
              content: buildCompletionMessage(
                session.topicLabel || session.topic,
                [...getEvaluationScores(messagesRef.current), evaluation.score]
              ),
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, completionMessage]);
            void persistMessage(completionMessage);
            snapshotMessages = [...snapshotMessages, completionMessage];
            void closeSession(session.sessionId).catch(() => undefined);
          }

          const gap = await syncLatestGap();
          void persistExamState(snapshotMessages, gap);
          setIsStreaming(false);
        } catch (err: any) {
          if (err.status === 429 && retries < 3) {
            retries++;
            await new Promise((r) => setTimeout(r, retries * 1000));
            return attempt();
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    content: getUserFacingError(err),
                    isError: true,
                    isStreaming: false,
                  }
                : m
            )
          );
          setIsStreaming(false);
        }
      };

      await attempt();
    },
    [
      session.sessionId,
      session.studentId,
      session.topicId,
      session.topicLabel,
      session.topic,
      session.level,
      onEvaluationComplete,
      persistMessage,
      persistExamState,
      syncLatestGap,
      typeAssistantMessage,
    ]
  );

  const submitQuizAnswer = useCallback(
    async (quiz: QuizBlock | undefined, selectedIndex: number) => {
      const topicId = session.topicId;
      if (!quiz || !session.sessionId || topicId === null) {
        return { correct: false, feedback: 'TutorBot could not score this quiz.' };
      }

      const selectedOption = quiz.options[selectedIndex];
      const userMsg: Message = {
        id: nanoid(),
        sessionId: session.sessionId,
        role: 'user',
        content: selectedOption,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      void persistMessage(userMsg);

      const evaluation = await submitEvaluation({
        sessionId: session.sessionId,
        studentId: session.studentId,
        topicId,
        questionText: quiz.question,
        studentAnswer: selectedOption,
        correctAnswer: quiz.options[quiz.correct] || null,
        maxScore: 10,
        skillLevel: session.level,
      });

      const botMessage: Message = {
        id: nanoid(),
        sessionId: session.sessionId,
        role: 'assistant',
        content: evaluation.feedback,
        timestamp: Date.parse(evaluation.evaluatedAt) || Date.now(),
        score: evaluation.score,
      };
      setMessages((prev) => [...prev, botMessage]);
      void persistMessage(botMessage);

      const correct = evaluation.score >= 10;
      onQuizGraded(correct, session.topicLabel || session.topic);
      await syncLatestGap();

      return {
        correct,
        feedback: evaluation.feedback,
      };
    },
    [
      onQuizGraded,
      persistMessage,
      session.level,
      session.sessionId,
      session.studentId,
      session.topic,
      session.topicId,
      session.topicLabel,
      syncLatestGap,
    ]
  );

  const retryLast = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;

    // Remove error message
    setMessages((prev) => prev.filter((m) => !m.isError));
    sendMessage(lastUser.content);
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isStreaming,
    retryLast,
    clearMessages,
    latestGap,
    submitQuizAnswer,
    isLoadingHistory,
    examCompleted,
    examProgress,
    examSummary,
    totalQuestions: TOTAL_EXAM_QUESTIONS,
  };
}
