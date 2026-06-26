interface Props {
  percent: number;
  label: string;
  sublabel?: string;
}

export function ProgressBar({ percent, label, sublabel }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-white/80 truncate pr-2">{label}</span>
        {sublabel && <span className="text-xs text-white/40 shrink-0">{sublabel}</span>}
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}
