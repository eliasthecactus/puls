export interface LocalizedString { de: string; en: string }

export type AnimationType =
  | 'arm-circle'
  | 'pushup'
  | 'squat'
  | 'plank'
  | 'lunge'
  | 'jumping-jacks'
  | 'mountain-climber'
  | 'burpee'
  | 'situp'
  | 'hip-hinge'
  | 'high-knees'
  | 'dips'
  | 'pike-pushup'
  | 'side-plank'
  | 'glute-bridge'
  | 'calf-raise'
  | 'dead-bug'
  | 'inchworm'
  | 'stretch-quad'
  | 'stretch-hamstring'
  | 'stretch-shoulder'
  | 'stretch-hip'
  | 'world-greatest-stretch';

// Muscle names must exactly match react-body-highlighter's Muscle type
export type MuscleName =
  | 'trapezius' | 'upper-back' | 'lower-back' | 'chest' | 'biceps' | 'triceps'
  | 'forearm' | 'back-deltoids' | 'front-deltoids' | 'abs' | 'obliques'
  | 'adductor' | 'abductors' | 'hamstring' | 'quadriceps' | 'calves'
  | 'gluteal' | 'head' | 'neck' | 'knees' | 'left-soleus' | 'right-soleus';

export interface Exercise {
  id: string;
  name: LocalizedString;
  detail: LocalizedString;
  duration: number;
  reps?: number;
  formTip?: LocalizedString;
  /** Legacy stick-figure animation hint. Pool exercises use imageUrl instead. */
  animationType?: AnimationType;
  /** Image/GIF URL resolved from the exercise pool. */
  imageUrl?: string;
  primaryMuscles: MuscleName[];
  secondaryMuscles?: MuscleName[];
}

export interface Section {
  id: string;
  name: string;
  label: LocalizedString;
  rounds: number;
  restBetweenRounds: number;
  restAfterSection?: number;
  exercises: Exercise[];
}

export type WorkoutIconType = 'dumbbell' | 'barbell' | 'legs' | 'core' | 'lightning' | 'flower' | 'pull' | 'heart';

/**
 * Runtime, fully-resolved workout (full Exercise objects in each section).
 * Built from a system or custom plan via lib/training.ts. Duration is computed
 * from the sections, never stored.
 */
export interface WorkoutPlan {
  id: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  category?: string;
  /** Computed from sections (minutes). Optional on static fallback data. */
  duration?: number;
  /** Marks user-created plans so the UI can route edits to the right place. */
  isCustom?: boolean;
  sections: Section[];
}

export type WorkoutPhase = 'exercise' | 'rest' | 'section-rest' | 'complete';
export type WorkoutIntensity = 'normal' | 'intense';

export interface WorkoutHistoryEntry {
  id: string;
  workoutId: string;
  workoutName: string;
  duration: number;
  intensity: WorkoutIntensity;
  completedAt: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface StreakData {
  streak: number;
  totalWorkouts: number;
}

// Exercise stored in DB (the single source of truth — used by both system and
// custom trainings, which reference exercises by id). Exercises have no duration
// of their own; duration is set per-exercise inside a training.
export interface DbExercise {
  id: string;
  nameDE: string;
  nameEN: string;
  detailDE: string;
  detailEN: string;
  formTipDE?: string;
  formTipEN?: string;
  imageUrl?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  createdAt: string;
  updatedAt: string;
}

/** A reference to a pool exercise with its per-training duration. */
export interface RefExercise {
  exerciseId: string;
  duration: number;
}

/** A block within a training. Shared by system + custom plans. */
export interface RefSection {
  id: string;
  label: string;
  rounds: number;
  restBetweenRounds: number;
  restAfterSection: number;
  exercises: RefExercise[];
}

// Backwards-compatible aliases (custom plans use the same ref-based shape).
export type CustomPlanExercise = RefExercise;
export type CustomPlanSection = RefSection;

export interface CustomPlan {
  id: string;
  userId: string;
  name: string;
  sections: RefSection[];
  createdAt: string;
  updatedAt: string;
}

// System plan as stored in DB. Single-language content; the name is a planet
// key resolved to a localized label in the UI. Duration is computed, not stored.
export interface SystemPlan {
  id: string;
  /** Planet key, e.g. "mercury" — unique across system plans. */
  planetKey: string;
  subtitle: string;
  category: string;
  sections: RefSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  lastActiveAt: string | null;
  createdAt: string;
  credentialCount: number;
  workoutCount: number;
}
