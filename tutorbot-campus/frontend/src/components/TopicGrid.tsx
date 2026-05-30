import type { Topic } from '../types';

type Props = {
  topics: Topic[];
  selected: string;
  onSelect: (topicId: string) => void;
  loading?: boolean;
  error?: string;
};

export default function TopicGrid({
  topics,
  selected,
  onSelect,
  loading,
  error,
}: Props) {
  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-brand-coral/20 bg-brand-coral-light px-4 py-3 text-sm text-brand-coral">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[132px] rounded-2xl border border-black/10 bg-white animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                selected === topic.id
                  ? 'border-brand-green bg-brand-green-light shadow-sm'
                  : 'border-black/10 bg-white hover:bg-surface-secondary hover:border-black/20'
              }`}
            >
              <div className="text-2xl mb-2">{topic.icon}</div>
              <div className="text-sm font-medium text-txt">{topic.label}</div>
              <div className="text-xs text-txt-muted mt-1 leading-relaxed">
                {topic.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
