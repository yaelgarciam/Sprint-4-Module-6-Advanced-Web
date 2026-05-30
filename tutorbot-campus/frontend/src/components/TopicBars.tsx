type TopicStat = {
  topic: string;
  correct: number;
  total: number;
};

type Props = {
  topicStats: Record<string, { correct: number; total: number }>;
};

export default function TopicBars({ topicStats }: Props) {
  const entries: TopicStat[] = Object.entries(topicStats).map(
    ([topic, stat]) => ({
      topic,
      ...stat,
    })
  );

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-5">
        <div className="font-mono text-[10px] text-txt-subtle uppercase tracking-wider mb-4">
          Topic Progress
        </div>
        <p className="text-sm text-txt-muted">
          No quizzes taken yet. Start a session to see your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5">
      <div className="font-mono text-[10px] text-txt-subtle uppercase tracking-wider mb-4">
        Topic Progress
      </div>
      <div className="flex flex-col gap-4">
        {entries.map((entry) => {
          const pct =
            entry.total > 0
              ? Math.round((entry.correct / entry.total) * 100)
              : 0;
          return (
            <div key={entry.topic}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-txt capitalize">
                  {entry.topic}
                </span>
                <span className="text-xs text-txt-muted">
                  {entry.correct}/{entry.total} ({pct}%)
                </span>
              </div>
              <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-green rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
