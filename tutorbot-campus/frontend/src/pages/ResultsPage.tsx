import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestGap } from '../api/gaps';
import { getMessages, getSession } from '../api/sessions';
import type { ExamResult, ExamSummary, GapAlert, Message, SessionData, StudyRecommendation } from '../types';
import { buildExamSnapshot, hydrateStudyRecommendations, TOTAL_EXAM_QUESTIONS } from '../utils/examResults';

type Props = {
  session: SessionData;
  onReset: () => void;
};

export default function ResultsPage({ session, onReset }: Props) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [latestGap, setLatestGap] = useState<GapAlert | null>(null);
  const [storedResults, setStoredResults] = useState<ExamResult[]>([]);
  const [storedSummary, setStoredSummary] = useState<ExamSummary | null>(null);
  const [recommendedTopics, setRecommendedTopics] = useState<StudyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session.sessionId) {
      navigate('/');
    }
  }, [navigate, session.sessionId]);

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      if (!session.sessionId) {
        return;
      }

      setIsLoading(true);
      try {
        const [sessionDetails, history, gap] = await Promise.all([
          getSession(session.sessionId),
          getMessages(session.sessionId),
          session.studentId ? getLatestGap(session.studentId).catch(() => null) : Promise.resolve(null),
        ]);

        if (!cancelled) {
          setStoredResults(sessionDetails.examResults || []);
          setStoredSummary(sessionDetails.examSummary || null);
          setRecommendedTopics(sessionDetails.recommendedTopics || []);
          setMessages(history);
          setLatestGap(gap);
        }
      } catch {
        if (!cancelled) {
          setStoredResults([]);
          setStoredSummary(null);
          setRecommendedTopics([]);
          setMessages([]);
          setLatestGap(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, [session.sessionId, session.studentId]);

  const fallbackSnapshot = useMemo(
    () => buildExamSnapshot(session.topicLabel || session.topic, messages, latestGap),
    [latestGap, messages, session.topic, session.topicLabel]
  );
  const results = storedResults.length > 0 ? storedResults : fallbackSnapshot.examResults;
  const summary = storedSummary || fallbackSnapshot.examSummary;
  const studyTopics = hydrateStudyRecommendations(
    session.topicLabel || session.topic,
    recommendedTopics,
    results,
    latestGap
  );
  const strongestItem = results.reduce<ExamResult | null>((best, current) => {
    if (!best) return current;
    return (current.score || 0) > (best.score || 0) ? current : best;
  }, null);
  const weakestItem = results.reduce<ExamResult | null>((worst, current) => {
    if (!worst) return current;
    return (current.score || 0) < (worst.score || 0) ? current : worst;
  }, null);
  const topicLabel = session.topicLabel || session.topic;
  const learningPathSteps = studyTopics.map((item, index) => ({
    step: index + 1,
    title: item.title,
    reason: item.reason,
    priority: item.priority,
    studyPlan: item.studyPlan,
    resources: item.resources || [],
  }));

  return (
    <div className="min-h-screen pt-[52px] bg-surface">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-2 font-mono text-[11px] text-txt-subtle tracking-wider">
          EXAM RESULTS
        </div>
        <h1 className="font-serif font-semibold text-4xl text-txt mb-2">
          {topicLabel} <em className="text-brand-green italic">Summary</em>
        </h1>
        <p className="text-base font-light text-txt-muted mb-8 max-w-2xl leading-relaxed">
          Review your performance, question-by-question feedback, and the next topic area you should reinforce.
        </p>

        {isLoading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-txt-muted">
            Loading your exam results…
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fadein">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle">Answered</div>
                <div className="mt-2 text-3xl font-serif text-txt">
                  {summary.answeredQuestions}/{summary.totalQuestions || TOTAL_EXAM_QUESTIONS}
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle">Average Score</div>
                <div className="mt-2 text-3xl font-serif text-txt">{summary.averageScore}/100</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle">Focus Area</div>
                <div className="mt-2 text-sm leading-relaxed text-txt">
                  {summary.recommendedFocus}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle mb-2">Learning Path</div>
              <div className="text-sm text-txt-muted mb-4">
                Follow this post-exam path to reinforce the weakest areas detected in {topicLabel}.
              </div>
              {studyTopics.length === 0 ? (
                <p className="text-sm text-txt-muted">No recommendations were available for this session yet.</p>
              ) : (
                <div className="space-y-4">
                  {learningPathSteps.map((item) => (
                    <div key={`${item.step}-${item.title}`} className="rounded-xl border border-black/10 bg-surface p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-[#C0DD97] text-sm font-semibold">
                            {item.step}
                          </div>
                          <div className="font-medium text-txt">{item.title}</div>
                        </div>
                        <span className="rounded-full border border-black/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-txt-subtle">
                          {item.priority}
                        </span>
                      </div>
                      <div className="mt-3 text-xs font-mono uppercase tracking-wider text-txt-subtle">
                        Step {item.step} of {learningPathSteps.length}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-txt-muted">{item.reason}</div>
                      {item.studyPlan && (
                        <div className="mt-3 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-txt">
                          <span className="font-medium">Study recommendation:</span> {item.studyPlan}
                        </div>
                      )}
                      {item.resources.length > 0 && (
                        <div className="mt-4">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-txt-subtle">Resources</div>
                          <div className="mt-2 space-y-2">
                            {item.resources.map((resource) => (
                              <a
                                key={`${item.step}-${resource.title}`}
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-lg border border-black/10 bg-white px-3 py-3 hover:bg-surface-secondary transition-colors"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="font-medium text-txt">{resource.title}</div>
                                  <span className="rounded-full border border-black/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-txt-subtle">
                                    {resource.type}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-txt-muted leading-relaxed">{resource.description}</div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle">Strongest Response</div>
                <div className="mt-3 text-sm text-txt">
                  {strongestItem ? (
                    <>
                      <div className="font-medium">Question {strongestItem.questionNumber}</div>
                      <div className="mt-1 text-txt-muted">{strongestItem.question}</div>
                      <div className="mt-2 text-brand-green">Score: {strongestItem.score || 0}/100</div>
                    </>
                  ) : (
                    'No graded answers available yet.'
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle">Needs Review</div>
                <div className="mt-3 text-sm text-txt">
                  {weakestItem ? (
                    <>
                      <div className="font-medium">Question {weakestItem.questionNumber}</div>
                      <div className="mt-1 text-txt-muted">{weakestItem.question}</div>
                      <div className="mt-2 text-brand-coral">Score: {weakestItem.score || 0}/100</div>
                    </>
                  ) : (
                    'No graded answers available yet.'
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-txt-subtle mb-4">Question Review</div>
              {results.length === 0 ? (
                <p className="text-sm text-txt-muted">No per-question results were available for this session.</p>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.questionNumber} className="rounded-xl border border-black/10 bg-surface p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-medium text-txt">Question {result.questionNumber}</div>
                        <div className="text-sm text-txt-muted">Score: {result.score || 0}/100</div>
                      </div>
                      <div className="mt-2 text-sm text-txt">{result.question}</div>
                      <div className="mt-3 text-[11px] font-mono uppercase tracking-wider text-txt-subtle">Your Answer</div>
                      <div className="mt-1 text-sm text-txt-muted">{result.answer}</div>
                      <div className="mt-3 text-[11px] font-mono uppercase tracking-wider text-txt-subtle">Feedback</div>
                      <div className="mt-1 text-sm text-txt-muted leading-relaxed">{result.feedback}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                onClick={() => navigate('/progress')}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm text-txt hover:bg-surface-secondary transition-colors"
              >
                View Progress
              </button>
              <button
                onClick={() => {
                  onReset();
                  navigate('/');
                }}
                className="px-4 py-2 rounded-lg bg-brand-green text-[#C0DD97] text-sm hover:bg-brand-green-dark transition-colors"
              >
                Start New Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}