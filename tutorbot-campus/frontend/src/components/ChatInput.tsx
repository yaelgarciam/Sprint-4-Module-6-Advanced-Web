import { useState, type KeyboardEvent, type FormEvent } from 'react';

type Props = {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
};

export default function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-3 py-2.5 border-t border-black/10 bg-surface flex gap-2 items-end"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Answer TutorBot's question…"}
        disabled={disabled}
        rows={1}
        className="flex-1 px-3 py-2 rounded-2xl border border-black/10 text-[13px] bg-white outline-none font-sans text-txt resize-none disabled:opacity-50 min-h-[38px] max-h-[120px]"
        style={{ fieldSizing: 'content' as any }}
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        title="Send answer"
        className="w-[34px] h-[34px] rounded-full bg-brand-green flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity hover:bg-brand-green-dark"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 stroke-[#C0DD97] fill-none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
        </svg>
      </button>
    </form>
  );
}
