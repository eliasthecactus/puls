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
  animationType: AnimationType;
  primaryMuscles: MuscleName[];
  secondaryMuscles?: MuscleName[];
}

export interface Section {
  id: string;
  name: string;
  label: LocalizedString;
  rounds: number;
  restBetweenRounds: number;
  exercises: Exercise[];
}

export type WorkoutIconType = 'dumbbell' | 'barbell' | 'legs' | 'core' | 'lightning' | 'flower' | 'pull' | 'heart';

export interface WorkoutPlan {
  id: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  category: string;
  duration: number;
  icon: WorkoutIconType;
  /** Two CSS hex colors for the card gradient, e.g. ['#7c3aed', '#4f46e5'] */
  color: [string, string];
  sections: Section[];
}

export type WorkoutPhase = 'exercise' | 'rest' | 'complete';
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
