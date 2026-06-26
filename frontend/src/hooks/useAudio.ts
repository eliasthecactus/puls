import { useRef, useCallback } from 'react';

type BeepType = 'countdown' | 'transition' | 'complete';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playBeep = useCallback(
    (type: BeepType) => {
      try {
        const ctx = getCtx();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
          case 'countdown': {
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
          }
          case 'transition': {
            // Two-tone ascending beep
            osc.frequency.setValueAtTime(660, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
          }
          case 'complete': {
            // Three ascending tones
            const freqs = [523, 659, 784, 1047];
            freqs.forEach((freq, i) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.connect(g);
              g.connect(ctx.destination);
              o.frequency.value = freq;
              o.type = 'sine';
              const start = now + i * 0.15;
              g.gain.setValueAtTime(0.35, start);
              g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
              o.start(start);
              o.stop(start + 0.25);
            });
            break;
          }
        }
      } catch {
        // Audio blocked or unavailable — silently ignore
      }
    },
    [getCtx],
  );

  const closeAudio = useCallback(() => {
    try {
      ctxRef.current?.close();
      ctxRef.current = null;
    } catch { /* ignore */ }
  }, []);

  return { playBeep, closeAudio };
}
