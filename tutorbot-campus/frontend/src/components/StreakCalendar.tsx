import { useMemo } from 'react';

type Props = {
  streak: number;
  lastActiveDate: string;
};

export default function StreakCalendar({ streak, lastActiveDate }: Props) {
  const days = useMemo(() => {
    const result: { date: string; active: boolean; today: boolean }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = i === 0;

      // Simple approximation: mark days within streak range as active
      const active = i < streak || (isToday && lastActiveDate === dateStr);

      result.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        active,
        today: isToday,
      });
    }
    return result;
  }, [streak, lastActiveDate]);

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5">
      <div className="font-mono text-[10px] text-txt-subtle uppercase tracking-wider mb-4">
        This Week
      </div>
      <div className="flex gap-3 justify-between">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="text-[10px] text-txt-subtle">{day.date}</div>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                day.active
                  ? 'bg-brand-green text-[#C0DD97]'
                  : day.today
                  ? 'bg-surface-secondary border border-dashed border-brand-green-mid text-txt-muted'
                  : 'bg-surface-secondary text-txt-subtle'
              }`}
            >
              {day.active ? '✓' : '·'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
