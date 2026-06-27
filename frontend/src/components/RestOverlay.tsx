import { useMemo } from 'react';

interface Props {
  seconds: number;
  onSkip: () => void;
  /** Override the "Pause" heading — use e.g. "Next Block" for section-rest */
  label?: string;
  /** Name shown below the timer */
  nextExerciseName?: string;
  /** Prefix text before nextExerciseName */
  nextLabel?: string;
}

export function RestOverlay({ seconds, onSkip, label = 'Pause', nextExerciseName, nextLabel = 'Next' }: Props) {
  const display = useMemo(() => String(Math.ceil(seconds)), [seconds]);
  const isLow = seconds <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl" />
      <div className="relative flex flex-col items-center gap-6 text-center px-6 animate-scale-in">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white">{label}</h2>

        <div className={`text-8xl font-bold tabular-nums transition-colors duration-300 ${isLow ? 'text-orange-400' : 'text-white'}`}>
          {display}
        </div>

        {nextExerciseName && (
          <div className="text-gray-400 text-sm">
            {nextLabel}: <span className="text-white font-medium">{nextExerciseName}</span>
          </div>
        )}

        <button
          onClick={onSkip}
          className="mt-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all active:scale-95"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
