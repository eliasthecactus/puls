import { useI18nStore } from '@/store/i18n';
import type { LocalizedString } from '@/types';
import { categoryI18nMap } from '@/data/categories';

export type Language = 'en' | 'de';

export interface Translations {
  // Landing / Auth
  tagline: string;
  featureTimer: string;
  featureMuscles: string;
  featureStreak: string;
  featurePasskey: string;
  ctaButton: string;
  noPasswordNote: string;

  // Nav / General
  logout: string;
  settings: string;
  back: string;
  home: string;
  save: string;
  share: string;
  cancel: string;
  saving: string;

  // Home
  readySubtitle: string;
  workoutsSection: string;
  filterAll: string;
  searchPlaceholder: string;
  sortLabel: string;
  sortDefault: string;
  sortName: string;
  sortDurationAsc: string;
  sortDurationDesc: string;
  durationAll: string;
  durationShort: string;
  durationMedium: string;
  durationLong: string;
  clearFilters: string;
  noResults: string;
  recentWorkouts: string;
  totalCount: (n: number) => string;
  noHistory: string;
  retry: string;
  favoritesSection: string;
  today: string;
  yesterday: string;
  daysAgo: (n: number) => string;
  intensiveLabel: string;
  workoutDone: string;
  timeLabel: string;
  exercisesLabel2: string;
  blocksLabel2: string;
  intensityLabel: string;
  normalLabel: string;
  streakDays: (n: number) => string;
  keepGoing: string;
  saveProgressHint: string;

  // WorkoutCard
  exercisesCount: (n: number) => string;
  blocksCount: (n: number) => string;
  categories: Record<string, string>;

  // StartScreen
  durationLabel: string;
  exercisesLabel: string;
  blocksLabel: string;
  muscleGroupsTitle: string;
  programSection: string;
  roundsLabel: string;
  normalMode: string;
  intenseMode: string;
  intensiveHint: string;
  startWorkout: string;

  // TimerScreen
  roundCounter: (current: number, total: number) => string;
  nextExercise: (name: string) => string;
  repsUnit: (n: number) => string;
  abortConfirm: string;
  tapToStart: string;

  // Muscle names
  muscleNames: Record<string, string>;

  // Language picker
  chooseLanguage: string;
  chooseLanguageSubtitle: string;
  continueButton: string;

  // Settings
  settingsTitle: string;
  profileSection: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;
  languageSection: string;
  savedConfirm: string;
  errorSaving: string;
}

const de: Translations = {
  tagline: 'Dein smarter Workout-Trainer',
  featureTimer: '10 geführte Workouts mit Timer',
  featureMuscles: 'Muskelgruppen-Visualisierung',
  featureStreak: 'Streak-Tracking & Verlauf',
  featurePasskey: 'Sicher mit Passkey – kein Passwort',
  ctaButton: 'Kostenlos starten',
  noPasswordNote: 'Kein Passwort. Keine E-Mail-Bestätigung. Passkey-Authentifizierung.',

  logout: 'Abmelden',
  settings: 'Einstellungen',
  back: 'Zurück',
  home: 'Zur Startseite',
  share: 'Teilen',
  save: 'Speichern',
  cancel: 'Abbrechen',
  saving: 'Speichern…',

  readySubtitle: 'Bereit für dein nächstes Workout?',
  workoutsSection: 'Workouts',
  recentWorkouts: 'Letzte Workouts',
  totalCount: (n) => `${n} gesamt`,
  noHistory: 'Noch keine Workouts',
  filterAll: 'Alle',
  searchPlaceholder: 'Workouts suchen…',
  sortLabel: 'Sortieren',
  sortDefault: 'Standard',
  sortName: 'Name',
  sortDurationAsc: 'Dauer ↑',
  sortDurationDesc: 'Dauer ↓',
  durationAll: 'Alle Längen',
  durationShort: '≤ 15 Min',
  durationMedium: '15–30 Min',
  durationLong: '> 30 Min',
  clearFilters: 'Filter zurücksetzen',
  noResults: 'Keine Workouts gefunden',
  retry: 'Erneut versuchen',
  favoritesSection: 'Favoriten',
  today: 'Heute',
  yesterday: 'Gestern',
  daysAgo: (n) => `Vor ${n} Tagen`,
  intensiveLabel: 'Intensiv',
  workoutDone: 'Workout abgeschlossen!',
  timeLabel: 'Zeit',
  exercisesLabel2: 'Übungen',
  blocksLabel2: 'Blöcke',
  intensityLabel: 'Intensität',
  normalLabel: 'Normal',
  streakDays: (n) => `${n} Tage in Folge!`,
  keepGoing: 'Weiter so!',
  saveProgressHint: 'Melde dich an, um deinen Fortschritt zu speichern.',

  exercisesCount: (n) => `${n} Übungen`,
  blocksCount: (n) => `${n} Blöcke`,
  categories: categoryI18nMap('de'),

  durationLabel: 'Dauer',
  exercisesLabel: 'Übungen',
  blocksLabel: 'Blöcke',
  muscleGroupsTitle: 'Trainierte Muskelgruppen',
  programSection: 'Programm',
  roundsLabel: 'Runden',
  normalMode: 'Normal',
  intenseMode: 'Intensiv +25%',
  intensiveHint: '+25% mehr Runden pro Block',
  startWorkout: 'Workout starten',

  roundCounter: (current, total) => `Runde ${current}/${total}`,
  nextExercise: (name) => `Weiter: ${name}`,
  repsUnit: (n) => `${n} Wdh.`,
  abortConfirm: 'Workout abbrechen?',
  tapToStart: 'Tippe zum Starten',

  muscleNames: {
    chest: 'Brust',
    biceps: 'Bizeps',
    triceps: 'Trizeps',
    'front-deltoids': 'Schultern v.',
    'back-deltoids': 'Schultern h.',
    trapezius: 'Trapez',
    'upper-back': 'Rücken o.',
    'lower-back': 'Rücken u.',
    abs: 'Bauch',
    obliques: 'Seite',
    quadriceps: 'Quads',
    hamstring: 'Hamstrings',
    gluteal: 'Gesäß',
    calves: 'Waden',
    adductor: 'Adduktoren',
    abductors: 'Abduktoren',
    forearm: 'Unterarm',
  },

  chooseLanguage: 'Sprache wählen',
  chooseLanguageSubtitle: 'Du kannst dies später in den Einstellungen ändern.',
  continueButton: 'Weiter',

  settingsTitle: 'Einstellungen',
  profileSection: 'Profil',
  displayNameLabel: 'Anzeigename',
  displayNamePlaceholder: 'Dein Name',
  languageSection: 'Sprache',
  savedConfirm: 'Gespeichert',
  errorSaving: 'Fehler beim Speichern',
};

const en: Translations = {
  tagline: 'Your smart workout trainer',
  featureTimer: '10 guided workouts with timer',
  featureMuscles: 'Muscle group visualization',
  featureStreak: 'Streak tracking & history',
  featurePasskey: 'Secure with passkey – no password',
  ctaButton: 'Get started for free',
  noPasswordNote: 'No password. No email verification. Passkey authentication.',

  logout: 'Log out',
  settings: 'Settings',
  back: 'Back',
  home: 'Home',
  share: 'Share',
  save: 'Save',
  cancel: 'Cancel',
  saving: 'Saving…',

  readySubtitle: 'Ready for your next workout?',
  workoutsSection: 'Workouts',
  recentWorkouts: 'Recent Workouts',
  totalCount: (n) => `${n} total`,
  noHistory: 'No workouts yet',
  filterAll: 'All',
  searchPlaceholder: 'Search workouts…',
  sortLabel: 'Sort',
  sortDefault: 'Default',
  sortName: 'Name',
  sortDurationAsc: 'Duration ↑',
  sortDurationDesc: 'Duration ↓',
  durationAll: 'Any length',
  durationShort: '≤ 15 min',
  durationMedium: '15–30 min',
  durationLong: '> 30 min',
  clearFilters: 'Clear filters',
  noResults: 'No workouts found',
  favoritesSection: 'Favorites',
  today: 'Today',
  yesterday: 'Yesterday',
  daysAgo: (n) => `${n} days ago`,
  intensiveLabel: 'Intense',
  workoutDone: 'Workout complete!',
  timeLabel: 'Time',
  exercisesLabel2: 'Exercises',
  blocksLabel2: 'Blocks',
  intensityLabel: 'Intensity',
  normalLabel: 'Normal',
  streakDays: (n) => `${n} days in a row!`,
  keepGoing: 'Keep it up!',
  saveProgressHint: 'Sign in to save your progress.',
  retry: 'Try again',

  exercisesCount: (n) => `${n} exercises`,
  blocksCount: (n) => `${n} blocks`,
  categories: categoryI18nMap('en'),

  durationLabel: 'Duration',
  exercisesLabel: 'Exercises',
  blocksLabel: 'Blocks',
  muscleGroupsTitle: 'Muscle groups trained',
  programSection: 'Program',
  roundsLabel: 'Rounds',
  normalMode: 'Normal',
  intenseMode: 'Intense +25%',
  intensiveHint: '+25% more rounds per block',
  startWorkout: 'Start workout',

  roundCounter: (current, total) => `Round ${current}/${total}`,
  nextExercise: (name) => `Next: ${name}`,
  repsUnit: (n) => `${n} reps`,
  abortConfirm: 'Abort workout?',
  tapToStart: 'Tap to start',

  muscleNames: {
    chest: 'Chest',
    biceps: 'Biceps',
    triceps: 'Triceps',
    'front-deltoids': 'Front delts',
    'back-deltoids': 'Rear delts',
    trapezius: 'Trapezius',
    'upper-back': 'Upper back',
    'lower-back': 'Lower back',
    abs: 'Abs',
    obliques: 'Obliques',
    quadriceps: 'Quads',
    hamstring: 'Hamstrings',
    gluteal: 'Glutes',
    calves: 'Calves',
    adductor: 'Adductors',
    abductors: 'Abductors',
    forearm: 'Forearm',
  },

  chooseLanguage: 'Choose your language',
  chooseLanguageSubtitle: 'You can change this later in settings.',
  continueButton: 'Continue',

  settingsTitle: 'Settings',
  profileSection: 'Profile',
  displayNameLabel: 'Display name',
  displayNamePlaceholder: 'Your name',
  languageSection: 'Language',
  savedConfirm: 'Saved',
  errorSaving: 'Error saving',
};

export const translations: Record<Language, Translations> = { de, en };

export function useT(): Translations {
  const language = useI18nStore((s) => s.language);
  return translations[language];
}

export function useLocalStr(): (ls: LocalizedString) => string {
  const language = useI18nStore((s) => s.language);
  return (ls: LocalizedString) => ls[language];
}
