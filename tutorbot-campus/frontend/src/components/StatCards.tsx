type Props = {
  streak: number;
  sessionsCompleted: number;
  quizAccuracy: number;
  totalQuizzes: number;
};

export default function StatCards({
  streak,
  sessionsCompleted,
  quizAccuracy,
  totalQuizzes,
}: Props) {
  const stats = [
    {
      label: 'Day Streak',
      value: streak,
      icon: '🔥',
      color: 'bg-brand-coral-light text-brand-coral',
    },
    {
      label: 'Sessions',
      value: sessionsCompleted,
      icon: '📚',
      color: 'bg-brand-blue-light text-brand-blue',
    },
    {
      label: 'Quiz Accuracy',
      value: `${quizAccuracy}%`,
      icon: '🎯',
      color: 'bg-brand-green-light text-brand-green-dark',
    },
    {
      label: 'Quizzes Taken',
      value: totalQuizzes,
      icon: '🧩',
      color: 'bg-brand-amber-light text-brand-amber',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-black/10 p-5"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}
          >
            {stat.icon}
          </div>
          <div className="text-2xl font-serif font-light text-txt">
            {stat.value}
          </div>
          <div className="text-xs text-txt-muted mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
