export type Message = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
  quiz?: QuizBlock;
  score?: number;
};

export type ExamResult = {
  questionNumber: number;
  question: string;
  answer: string;
  feedback: string;
  score?: number;
  topicFocus?: string;
};

export type ExamSummary = {
  answeredQuestions: number;
  totalQuestions: number;
  averageScore: number;
  performanceLabel: string;
  recommendedFocus: string;
};

export type StudyRecommendation = {
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  studyPlan?: string;
  resources?: StudyResource[];
};

export type StudyResource = {
  type: 'book' | 'article' | 'docs' | 'video' | 'practice';
  title: string;
  url: string;
  description: string;
};

export type QuizBlock = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type Topic = {
  id: string;
  topicId: number;
  label: string;
  icon: string;
  description: string;
};

export type GapAlert = {
  id?: string;
  topicId?: number;
  severity: number;
  message: string;
  detectedAt?: string;
};

export type LeaderboardEntry = {
  studentId: string;
  score: number;
  rank: number;
};

export type Level = 'beginner' | 'intermediate' | 'advanced';

export type SessionData = {
  sessionId: string;
  studentId: string;
  topic: string;
  topicId: number | null;
  topicLabel: string;
  level: Level;
  streak: number;
  lastActiveDate: string;
  sessionsCompleted: number;
  quizAccuracy: number;
  totalQuizzes: number;
  correctQuizzes: number;
  evaluationCount: number;
  topicStats: Record<string, { correct: number; total: number }>;
  examResults?: ExamResult[];
  examSummary?: ExamSummary | null;
  recommendedTopics?: StudyRecommendation[];
};
