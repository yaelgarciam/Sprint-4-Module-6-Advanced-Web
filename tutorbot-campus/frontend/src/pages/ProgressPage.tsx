import { useEffect, useState } from 'react';
import StatCards from '../components/StatCards';
import StreakCalendar from '../components/StreakCalendar';
import TopicBars from '../components/TopicBars';
import { getLeaderboard } from '../api/gaps';
import type { LeaderboardEntry, SessionData } from '../types';

type Props = {
  session: SessionData;
  onReset: () => void;
};

export default function ProgressPage({ session, onReset }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadLeaderboard = async () => {
      if (!session.topicId) {
        setLeaderboard([]);
        return;
      }

      try {
        const items = await getLeaderboard(session.topicId);
        if (!cancelled) {
          setLeaderboard(items.slice(0, 5));
        }
      } catch {
        if (!cancelled) {
          setLeaderboard([]);
        }
      }
    };

    void loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [session.topicId]);

  return (
    <div className="min-h-screen pt-[52px] bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-2 font-mono text-[11px] text-txt-subtle tracking-wider">
          PROGRESS
        </div>
        <h1 className="font-serif font-semibold text-4xl text-txt mb-2">
          Your <em className="text-brand-green italic">Journey</em>
        </h1>
        <p className="text-base font-light text-txt-muted mb-8 max-w-md leading-relaxed">
          Track your learning streak, quiz accuracy, and topic mastery over
          time.
        </p>

        <div className="flex flex-col gap-6">
          <StatCards
            streak={session.streak}
            sessionsCompleted={session.sessionsCompleted}
            quizAccuracy={session.quizAccuracy}
            totalQuizzes={session.totalQuizzes}
          />

          <StreakCalendar
            streak={session.streak}
            lastActiveDate={session.lastActiveDate}
          />

          <TopicBars topicStats={session.topicStats} />

          <div className="bg-white rounded-2xl border border-black/10 p-5">
            <div className="font-mono text-[10px] text-txt-subtle uppercase tracking-wider mb-4">
              Leaderboard
            </div>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-txt-muted">
                No leaderboard data for this topic yet.
              </p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={`${entry.rank}-${entry.studentId}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-txt">
                      #{entry.rank} · {entry.studentId}
                    </span>
                    <span className="text-txt-muted">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg border border-black/10 text-sm text-txt-muted hover:bg-surface-secondary transition-colors"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
