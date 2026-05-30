import type { Message } from '../types';
import { stripQuizBlock } from '../utils/parseQuiz';

type Props = {
  message: Message;
  onRetry?: () => void;
};

export default function BotMessage({ message, onRetry }: Props) {
  const content = stripQuizBlock(message.content);

  if (message.isError) {
    return (
      <div className="max-w-[82%] self-start">
        <div
          className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed bg-brand-coral-light border border-brand-coral/20 text-brand-coral cursor-pointer"
          onClick={onRetry}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[82%] self-start">
      <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed bg-surface border border-black/10 text-txt">
        {content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </span>
        ))}
        {message.isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-brand-green ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
      <div className="text-[10px] text-txt-subtle mt-0.5 px-1">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}
