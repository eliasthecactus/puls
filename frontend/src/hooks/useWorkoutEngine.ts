import { useState, useRef, useCallback, useEffect } from 'react';
import type { WorkoutPlan, WorkoutPhase, WorkoutIntensity, Exercise, Section } from '@/types';
import { useAudio } from './useAudio';

export interface WorkoutEngineState {
  currentSectionIndex: number;
  currentRoundIndex: number;
  currentExerciseIndex: number;
  timeRemaining: number;
  restTimeRemaining: number;
  totalElapsed: number;
  phase: WorkoutPhase;
  isRunning: boolean;
  isPaused: boolean;
  currentExercise: Exercise | null;
  currentSection: Section | null;
  progressPercent: number;
  totalSections: number;
  roundsForCurrentSection: number;
  repCount: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  skipRest: () => void;
  incrementRep: () => void;
  decrementRep: () => void;
}

function getRoundsForSection(section: Section, intensity: WorkoutIntensity): number {
  if (intensity === 'intense') return Math.ceil(section.rounds * 1.25);
  return section.rounds;
}

export function useWorkoutEngine(plan: WorkoutPlan, intensity: WorkoutIntensity): WorkoutEngineState {
  const { playBeep, closeAudio } = useAudio();

  const [sectionIdx, setSectionIdx] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [phase, setPhase] = useState<WorkoutPhase>('exercise');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [repCount, setRepCount] = useState(0);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef({
    sectionIdx: 0,
    roundIdx: 0,
    exerciseIdx: 0,
    timeRemaining: 0,
    restTimeRemaining: 0,
    totalElapsed: 0,
    phase: 'exercise' as WorkoutPhase,
    isRunning: false,
    isPaused: false,
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = { sectionIdx, roundIdx, exerciseIdx, timeRemaining, restTimeRemaining, totalElapsed, phase, isRunning, isPaused };
  });

  const currentSection = plan.sections[sectionIdx] ?? null;
  const currentExercise = currentSection?.exercises[exerciseIdx] ?? null;
  const roundsForCurrentSection = currentSection ? getRoundsForSection(currentSection, intensity) : 1;

  // Progress: count total exercise+rest slots across all sections
  const progressPercent = (() => {
    if (phase === 'complete') return 100;
    let total = 0;
    let done = 0;
    plan.sections.forEach((sec, si) => {
      const rounds = getRoundsForSection(sec, intensity);
      const slots = rounds * sec.exercises.length + Math.max(0, rounds - 1);
      total += slots;
      if (si < sectionIdx) {
        done += slots;
      } else if (si === sectionIdx) {
        done += roundIdx * sec.exercises.length + Math.max(0, roundIdx - (phase === 'rest' ? 0 : 1));
        done += exerciseIdx;
      }
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  })();

  const goToExercise = useCallback(
    (si: number, ri: number, ei: number) => {
      const sec = plan.sections[si];
      if (!sec) return;
      const ex = sec.exercises[ei];
      if (!ex) return;
      setSectionIdx(si);
      setRoundIdx(ri);
      setExerciseIdx(ei);
      setTimeRemaining(ex.duration);
      setPhase('exercise');
      setRepCount(0);
    },
    [plan],
  );

  const goToRest = useCallback(
    (si: number, ri: number) => {
      const sec = plan.sections[si];
      if (!sec) return;
      setRestTimeRemaining(sec.restBetweenRounds);
      setPhase('rest');
      setSectionIdx(si);
      setRoundIdx(ri);
    },
    [plan],
  );

  const advance = useCallback(() => {
    const s = stateRef.current;
    const sec = plan.sections[s.sectionIdx];
    if (!sec) return;
    const rounds = getRoundsForSection(sec, intensity);

    // Move to next exercise in same round
    if (s.exerciseIdx < sec.exercises.length - 1) {
      goToExercise(s.sectionIdx, s.roundIdx, s.exerciseIdx + 1);
      playBeep('transition');
      return;
    }

    // End of round
    if (s.roundIdx < rounds - 1) {
      // More rounds: go to rest if rest time > 0
      if (sec.restBetweenRounds > 0) {
        goToRest(s.sectionIdx, s.roundIdx + 1);
        playBeep('transition');
      } else {
        goToExercise(s.sectionIdx, s.roundIdx + 1, 0);
        playBeep('transition');
      }
      return;
    }

    // End of section
    if (s.sectionIdx < plan.sections.length - 1) {
      goToExercise(s.sectionIdx + 1, 0, 0);
      playBeep('transition');
      return;
    }

    // Workout complete
    setPhase('complete');
    setIsRunning(false);
    playBeep('complete');
  }, [plan, intensity, goToExercise, goToRest, playBeep]);

  const advanceFromRest = useCallback(() => {
    const s = stateRef.current;
    goToExercise(s.sectionIdx, s.roundIdx, 0);
    playBeep('transition');
  }, [goToExercise, playBeep]);

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      const s = stateRef.current;
      if (!s.isRunning || s.isPaused) return;

      setTotalElapsed((e) => e + 0.1);

      if (s.phase === 'rest') {
        setRestTimeRemaining((t) => {
          const next = Math.max(0, t - 0.1);
          if (next <= 0) advanceFromRest();
          return next;
        });
        return;
      }

      setTimeRemaining((t) => {
        const next = Math.max(0, t - 0.1);
        const rounded = Math.ceil(next);
        const prevRounded = Math.ceil(t);

        if (prevRounded !== rounded) {
          if (rounded === 10 || rounded === 5) playBeep('countdown');
          if (rounded <= 3 && rounded > 0) playBeep('countdown');
        }

        if (next <= 0) advance();
        return next;
      });
    }, 100);
  }, [stopTick, advance, advanceFromRest, playBeep]);

  const start = useCallback(() => {
    goToExercise(0, 0, 0);
    setTotalElapsed(0);
    setIsRunning(true);
    setIsPaused(false);
    startTick();
  }, [goToExercise, startTick]);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);
  }, []);

  const next = useCallback(() => {
    advance();
  }, [advance]);

  const prev = useCallback(() => {
    const s = stateRef.current;
    if (s.exerciseIdx > 0) {
      goToExercise(s.sectionIdx, s.roundIdx, s.exerciseIdx - 1);
    } else if (s.roundIdx > 0) {
      const sec = plan.sections[s.sectionIdx];
      if (sec) goToExercise(s.sectionIdx, s.roundIdx - 1, sec.exercises.length - 1);
    } else if (s.sectionIdx > 0) {
      const prevSec = plan.sections[s.sectionIdx - 1];
      if (prevSec) {
        const rounds = getRoundsForSection(prevSec, intensity);
        goToExercise(s.sectionIdx - 1, rounds - 1, prevSec.exercises.length - 1);
      }
    }
  }, [plan, intensity, goToExercise]);

  const skipRest = useCallback(() => {
    advanceFromRest();
  }, [advanceFromRest]);

  const incrementRep = useCallback(() => setRepCount((c) => c + 1), []);
  const decrementRep = useCallback(() => setRepCount((c) => Math.max(0, c - 1)), []);

  // Sync isRunning into ref for tick
  useEffect(() => {
    if (isRunning && !isPaused && !tickRef.current) startTick();
    if (!isRunning || isPaused) stopTick();
  }, [isRunning, isPaused, startTick, stopTick]);

  useEffect(() => () => { stopTick(); closeAudio(); }, [stopTick, closeAudio]);

  // Init first exercise duration on mount
  useEffect(() => {
    const first = plan.sections[0]?.exercises[0];
    if (first) setTimeRemaining(first.duration);
  }, [plan]);

  return {
    currentSectionIndex: sectionIdx,
    currentRoundIndex: roundIdx,
    currentExerciseIndex: exerciseIdx,
    timeRemaining,
    restTimeRemaining,
    totalElapsed,
    phase,
    isRunning,
    isPaused,
    currentExercise,
    currentSection,
    progressPercent,
    totalSections: plan.sections.length,
    roundsForCurrentSection,
    repCount,
    start,
    pause,
    resume,
    next,
    prev,
    skipRest,
    incrementRep,
    decrementRep,
  };
}
