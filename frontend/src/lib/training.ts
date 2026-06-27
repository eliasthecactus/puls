import type {
  DbExercise,
  Exercise,
  MuscleName,
  RefSection,
  Section,
  SystemPlan,
  CustomPlan,
  WorkoutPlan,
} from '@/types';
import { planetName } from '@/data/planets';

/** Turn a pool exercise + per-training duration into a runtime Exercise. */
function refToExercise(db: DbExercise, duration: number): Exercise {
  const hasTip = !!(db.formTipDE || db.formTipEN);
  return {
    id: db.id,
    name: { de: db.nameDE, en: db.nameEN },
    detail: { de: db.detailDE ?? '', en: db.detailEN ?? '' },
    duration,
    formTip: hasTip ? { de: db.formTipDE ?? '', en: db.formTipEN ?? '' } : undefined,
    imageUrl: db.imageUrl || undefined,
    primaryMuscles: (db.primaryMuscles ?? []) as MuscleName[],
    secondaryMuscles: (db.secondaryMuscles ?? []) as MuscleName[],
  };
}

/**
 * Resolve ref-based sections into runtime sections with full exercise data.
 * Exercises whose id no longer exists in the pool are skipped.
 */
export function resolveSections(refSections: RefSection[], pool: DbExercise[]): Section[] {
  const byId = new Map(pool.map(e => [e.id, e]));
  return refSections.map(s => ({
    id: s.id,
    name: s.label,
    label: { de: s.label, en: s.label },
    rounds: s.rounds,
    restBetweenRounds: s.restBetweenRounds,
    restAfterSection: s.restAfterSection,
    exercises: s.exercises
      .map(ref => {
        const db = byId.get(ref.exerciseId);
        return db ? refToExercise(db, ref.duration) : null;
      })
      .filter((e): e is Exercise => e !== null),
  }));
}

/** Total workout duration in seconds: work + inter-round + inter-block rests. */
export function computeDurationSec(sections: Section[]): number {
  return sections.reduce((total, s, i) => {
    const work = s.exercises.reduce((sum, e) => sum + e.duration, 0);
    const roundsWork = work * s.rounds;
    const interRound = s.restBetweenRounds * Math.max(0, s.rounds - 1);
    const afterBlock = i < sections.length - 1 ? (s.restAfterSection ?? 0) : 0;
    return total + roundsWork + interRound + afterBlock;
  }, 0);
}

/** Rounded minutes, minimum 1, for display on cards. */
export function computeDurationMin(sections: Section[]): number {
  return Math.max(1, Math.round(computeDurationSec(sections) / 60));
}

/** Same computation directly from ref sections (no pool needed for timing). */
export function computeRefDurationMin(refSections: RefSection[]): number {
  const sections = refSections.map(s => ({
    ...s,
    name: s.label,
    label: { de: s.label, en: s.label },
    exercises: s.exercises.map(e => ({ id: e.exerciseId, name: { de: '', en: '' }, detail: { de: '', en: '' }, duration: e.duration, primaryMuscles: [] as MuscleName[] })),
  })) as Section[];
  return computeDurationMin(sections);
}

export function systemPlanToWorkoutPlan(sp: SystemPlan, pool: DbExercise[]): WorkoutPlan {
  const sections = resolveSections(sp.sections, pool);
  return {
    id: sp.id,
    name: planetName(sp.planetKey),
    subtitle: { de: sp.subtitle, en: sp.subtitle },
    category: sp.category,
    duration: computeDurationMin(sections),
    sections,
  };
}

export function customPlanToWorkoutPlan(cp: CustomPlan, pool: DbExercise[]): WorkoutPlan {
  const sections = resolveSections(cp.sections, pool);
  return {
    id: cp.id,
    name: { de: cp.name, en: cp.name },
    subtitle: { de: '', en: '' },
    duration: computeDurationMin(sections),
    isCustom: true,
    sections,
  };
}
