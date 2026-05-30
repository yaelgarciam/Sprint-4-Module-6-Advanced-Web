export default function TypingIndicator() {
  return (
    <div className="max-w-[82%] self-start">
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-surface border border-black/10 flex gap-1.5 items-center">
        <span className="w-2 h-2 rounded-full bg-brand-green-mid animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-green-mid animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-green-mid animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
