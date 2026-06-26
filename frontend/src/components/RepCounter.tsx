interface Props {
  count: number;
  target?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function RepCounter({ count, target, onIncrement, onDecrement }: Props) {
  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
      <button
        onClick={onDecrement}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white text-xl font-medium"
        aria-label="Wiederholung entfernen"
      >
        −
      </button>
      <div className="text-center min-w-[4rem]">
        <div className="text-3xl font-bold text-white tabular-nums">{count}</div>
        {target && (
          <div className="text-xs text-gray-400">
            Ziel: {target}
          </div>
        )}
      </div>
      <button
        onClick={onIncrement}
        className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all flex items-center justify-center text-white text-xl font-medium"
        aria-label="Wiederholung hinzufügen"
      >
        +
      </button>
    </div>
  );
}
