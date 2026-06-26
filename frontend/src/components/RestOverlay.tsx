import { useMemo } from 'react';

interface Props {
  seconds: number;
  onSkip: () => void;
  nextExerciseName?: string;
}

export function RestOverlay({ seconds, onSkip, nextExerciseName }: Props) {
  const display = useMemo(() => String(Math.ceil(seconds)), [seconds]);
  const isLow = seconds <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl" />
      <div className="relative flex flex-col items-center gap-6 text-center px-6 animate-scale-in">
        <div className="text-5xl">😮‍💨</div>
        <h2 className="text-3xl font-bold text-white">Pause</h2>

        <div className={`text-8xl font-bold tabular-nums transition-colors duration-300 ${isLow ? 'text-orange-400' : 'text-white'}`}>
          {display}
        </div>

        {nextExerciseName && (
          <div className="text-gray-400 text-sm">
            Nächste Übung: <span className="text-white font-medium">{nextExerciseName}</span>
          </div>
        )}

        <button
          onClick={onSkip}
          className="mt-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all active:scale-95"
        >
          Überspringen →
        </button>
      </div>
    </div>
  );
}
