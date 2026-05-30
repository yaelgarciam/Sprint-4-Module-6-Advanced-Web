import type { Message } from '../types';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';
import TypingIndicator from './TypingIndicator';
import QuizCard from './QuizCard';
import { useAutoScroll } from '../hooks/useAutoScroll';

type Props = {
  messages: Message[];
  isStreaming: boolean;
  onRetry?: () => void;
  onQuizAnswer?: (
    quiz: Message['quiz'],
    selectedIndex: number
  ) => Promise<{ correct: boolean; feedback?: string } | void>;
};

export default function MessageList({
  messages,
  isStreaming,
  onRetry,
  onQuizAnswer,
}: Props) {
  const scrollRef = useAutoScroll([messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
    >
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-green text-[#C0DD97] flex items-center justify-center font-serif font-semibold text-3xl mx-auto mb-4">
              T
            </div>
            <p className="text-txt-muted text-sm">
              Start a conversation with TutorBot!
            </p>
            <p className="text-txt-subtle text-xs mt-1">
              Type a question or topic to begin learning.
            </p>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.role === 'assistant' ? (
            <>
              <BotMessage message={msg} onRetry={onRetry} />
              {msg.quiz && !msg.isStreaming && (
                <div className="mt-2 ml-0">
                  <QuizCard
                    quiz={msg.quiz}
                    onAnswer={(_, selectedIndex) =>
                      onQuizAnswer
                        ? onQuizAnswer(msg.quiz, selectedIndex)
                        : Promise.resolve()
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <UserMessage message={msg} />
          )}
        </div>
      ))}

      {isStreaming &&
        messages.length > 0 &&
        messages[messages.length - 1].content === '' && <TypingIndicator />}
    </div>
  );
}
