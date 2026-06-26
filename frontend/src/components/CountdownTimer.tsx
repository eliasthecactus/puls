import { useMemo } from 'react';
import clsx from 'clsx';

interface Props {
  seconds: number;
  onClick?: () => void;
}

export function CountdownTimer({ seconds, onClick }: Props) {
  const display = useMemo(() => {
    const s = Math.ceil(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    if (m > 0) return `${m}:${rem.toString().padStart(2, '0')}`;
    return String(s);
  }, [seconds]);

  const isOrange = seconds <= 10 && seconds > 5;
  const isRed = seconds <= 5;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'tabular-nums font-bold leading-none select-none transition-all duration-300',
        'text-8xl sm:text-9xl',
        isRed && 'text-red-400 animate-pulse',
        isOrange && !isRed && 'text-orange-400',
        !isOrange && !isRed && 'text-white',
        onClick && 'cursor-pointer hover:opacity-80',
      )}
      aria-label={`${display} Sekunden verbleibend`}
    >
      {display}
    </button>
  );
}
