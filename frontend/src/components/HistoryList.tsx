import type { WorkoutHistoryEntry } from '@/types';
import { useT } from '@/i18n';

interface Props {
  entries: WorkoutHistoryEntry[];
  limit?: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m} Min`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function HistoryList({ entries, limit }: Props) {
  const t = useT();
  const shown = limit ? entries.slice(0, limit) : entries;

  function formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (days === 0) return t.today;
    if (days === 1) return t.yesterday;
    if (days < 7) return t.daysAgo(days);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }

  if (shown.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">{t.noHistory}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {shown.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between bg-gray-900 rounded-xl px-4 py-3 border border-white/5"
        >
          <div>
            <div className="text-white text-sm font-medium">{entry.workoutName}</div>
            <div className="text-gray-500 text-xs">{formatDate(entry.completedAt)}</div>
          </div>
          <div className="flex items-center gap-3">
            {entry.intensity === 'intense' && (
              <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full font-medium">
                {t.intensiveLabel}
              </span>
            )}
            <span className="text-gray-400 text-sm tabular-nums">{formatDuration(entry.duration)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
