import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { useStreamingChat } from '../hooks/useStreamingChat';
import type { SessionData } from '../types';

type Props = {
  session: SessionData;
  onEvaluationComplete: () => number;
  onQuizGraded: (correct: boolean, topic: string) => void;
};

export default function ChatPage({
  session,
  onEvaluationComplete,
  onQuizGraded,
}: Props) {
  const navigate = useNavigate();
  const {
    messages,
    sendMessage,
    isStreaming,
    retryLast,
    latestGap,
    submitQuizAnswer,
    isLoadingHistory,
    examCompleted,
    examProgress,
    examSummary,
    totalQuestions,
  } = useStreamingChat({
    session,
    onEvaluationComplete,
    onQuizGraded,
  });

  useEffect(() => {
    if (!session.topicId || !session.sessionId) {
      navigate('/');
    }
  }, [session.topicId, session.sessionId, navigate]);

  const topicLabel = session.topicLabel || session.topic;

  return (
    <div className="h-screen pt-[52px] flex flex-col bg-surface">
      {/* Chat sub-header */}
      <div className="px-4 py-3 border-b border-black/10 bg-white flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-green text-[#C0DD97] flex items-center justify-center font-serif font-semibold text-sm">
          T
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-medium text-txt">TutorBot</div>
          <div className="text-[11px] text-brand-green">
            ● {topicLabel} · {session.level} · {Math.min(examProgress + 1, totalQuestions)}/{totalQuestions}
          </div>
        </div>
        {isStreaming && (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue font-medium">
            Thinking…
          </span>
        )}
      </div>

      {latestGap && latestGap.severity > 0.7 && (
        <div className="mx-4 mt-4 rounded-2xl border border-brand-amber/20 bg-brand-amber-light px-4 py-3 text-sm text-brand-amber">
          {latestGap.message}
        </div>
      )}

      {isLoadingHistory && (
        <div className="px-4 pt-4 text-sm text-txt-muted">
          Restoring your synced session…
        </div>
      )}

      {examCompleted && (
        <div className="mx-4 mt-4 rounded-2xl border border-brand-green/20 bg-white px-4 py-3 text-sm text-txt">
          <div className="font-medium text-brand-green">Mini-exam completed</div>
          <div className="mt-2 text-txt-muted">
            You answered {examSummary.answeredQuestions}/{totalQuestions} questions with an average score of {examSummary.averageScore}/100.
          </div>
          <div className="mt-2 text-sm text-txt">
            <span className="font-medium">Performance:</span> {examSummary.performanceLabel}
          </div>
          <div className="mt-2 text-sm text-txt">
            <span className="font-medium">Recommended focus:</span> {examSummary.recommendedFocus}
          </div>
          <div className="mt-2 rounded-xl border border-black/10 bg-surface px-3 py-2 text-sm text-txt">
            <span className="font-medium">Learning path:</span> open the detailed results to see the ordered study steps for the topics you should reinforce next.
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => navigate('/results')}
              className="px-4 py-2 rounded-lg bg-brand-green text-[#C0DD97] text-sm hover:bg-brand-green-dark transition-colors"
            >
              View Detailed Results
            </button>
          </div>
        </div>
      )}

      <MessageList
        messages={messages}
        isStreaming={isStreaming}
        onRetry={retryLast}
        onQuizAnswer={submitQuizAnswer}
      />

      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming || examCompleted}
        placeholder={examCompleted ? 'This mini-exam is finished. Start a new session to try again.' : undefined}
      />
    </div>
  );
}
