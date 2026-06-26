interface Props {
  streak: number;
  totalWorkouts?: number;
}

export function StreakBadge({ streak, totalWorkouts }: Props) {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl px-4 py-3">
      <div className="text-3xl">🔥</div>
      <div>
        <div className="text-white font-bold text-lg leading-tight">
          {streak} {streak === 1 ? 'Tag' : 'Tage'} in Folge
        </div>
        {totalWorkouts !== undefined && (
          <div className="text-orange-300/70 text-xs">{totalWorkouts} Workouts gesamt</div>
        )}
      </div>
    </div>
  );
}
