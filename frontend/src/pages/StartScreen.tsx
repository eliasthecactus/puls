import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '@/store/workout';
import { MuscleGroupView, MuscleTagList } from '@/components/MuscleGroupView';
import { useT, useLocalStr } from '@/i18n';
import { useFavoritesStore } from '@/store/favorites';
import type { WorkoutIntensity, MuscleName } from '@/types';

export function StartScreen() {
  const navigate = useNavigate();
  const { selectedPlan, intensity, setIntensity } = useWorkoutStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!selectedPlan) {
    navigate('/');
    return null;
  }

  const t = useT();
  const ls = useLocalStr();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(selectedPlan.id);
  const totalExercises = selectedPlan.sections.reduce((s, sec) => s + sec.exercises.length, 0);
  const intensiveRounds = (base: number) => Math.ceil(base * 1.25);

  const allPrimary = Array.from(new Set(
    selectedPlan.sections.flatMap(s => s.exercises.flatMap(e => e.primaryMuscles))
  )) as MuscleName[];
  const allSecondary = Array.from(new Set(
    selectedPlan.sections.flatMap(s => s.exercises.flatMap(e => e.secondaryMuscles ?? []))
      .filter(m => !allPrimary.includes(m as MuscleName))
  )) as MuscleName[];

  return (
    <div className="h-dvh bg-gray-950 flex flex-col overflow-hidden">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-safe-or-4 left-4 z-10 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        style={{ top: 'max(env(safe-area-inset-top, 0px), 16px)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Favorite */}
      <button
        onClick={() => toggleFavorite(selectedPlan.id)}
        className="absolute z-20 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        style={{ top: 'max(env(safe-area-inset-top, 0px), 16px)', right: '16px' }}
        aria-label="Toggle favorite"
      >
        <svg
          className={`w-4 h-4 transition-colors ${favorite ? 'text-red-400 fill-red-400' : 'text-white/70'}`}
          fill={favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Header */}
      <div className="px-4 pt-14 pb-2 max-w-lg mx-auto w-full shrink-0">
        <div className="flex items-center gap-4">
          {/* Muscle diagrams */}
          <div className="flex gap-2 shrink-0">
            <MuscleGroupView primaryMuscles={allPrimary} secondaryMuscles={allSecondary} size={72} side="anterior" />
            <MuscleGroupView primaryMuscles={allPrimary} secondaryMuscles={allSecondary} size={72} side="posterior" />
          </div>
          {/* Title + stats */}
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-xl font-bold leading-tight">{ls(selectedPlan.name)}</h1>
            <p className="text-white/50 text-xs mb-2">{ls(selectedPlan.subtitle)}</p>
            <div className="flex gap-3">
              {[
                { label: t.durationLabel, value: `${selectedPlan.duration}m` },
                { label: t.exercisesLabel, value: String(totalExercises) },
                { label: t.blocksLabel, value: String(selectedPlan.sections.length) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-white text-sm font-bold">{value}</div>
                  <div className="text-white/40 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <MuscleTagList primary={allPrimary} secondary={allSecondary} />
        </div>
      </div>

      {/* Intensity toggle */}
      <div className="px-4 py-2 max-w-lg mx-auto w-full shrink-0">
        <div className="bg-gray-900 rounded-xl border border-white/5 p-1 flex">
          {(['normal', 'intense'] as WorkoutIntensity[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setIntensity(mode)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                intensity === mode
                  ? mode === 'intense'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-violet-600 text-white'
                  : 'text-gray-500'
              }`}
            >
              {mode === 'normal' ? t.normalMode : t.intenseMode}
            </button>
          ))}
        </div>
        {intensity === 'intense' && (
          <p className="text-orange-400/80 text-xs bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1.5 text-center mt-1.5">
            {t.intensiveHint}
          </p>
        )}
      </div>

      {/* Section list — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 max-w-lg mx-auto w-full">
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">{t.programSection}</h2>
        <div className="space-y-1.5 pb-2">
          {selectedPlan.sections.map((section, i) => {
            const rounds = intensity === 'intense' ? intensiveRounds(section.rounds) : section.rounds;
            const isOpen = expandedSection === section.id;
            return (
              <div key={section.id} className="bg-gray-900 rounded-xl border border-white/5 overflow-hidden">
                <button
                  className="w-full px-3 py-2.5 flex items-center justify-between"
                  onClick={() => setExpandedSection(isOpen ? null : section.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-violet-500/20 rounded-md flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="text-left">
                      <div className="text-white text-sm font-medium">{ls(section.label)}</div>
                      <div className="text-gray-500 text-xs">{t.exercisesCount(section.exercises.length)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-white text-sm font-semibold">{rounds}×</div>
                      <div className="text-gray-500 text-xs">{t.roundsLabel}</div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-white/5">
                    {section.exercises.map((ex, j) => (
                      <div key={ex.id} className={`px-3 py-2 flex items-start gap-2.5 ${j < section.exercises.length - 1 ? 'border-b border-white/5' : ''}`}>
                        <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-gray-500 text-xs shrink-0 mt-0.5">{j + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-white text-sm font-medium">{ls(ex.name)}</span>
                            <span className="text-gray-500 text-xs shrink-0">{ex.reps ? t.repsUnit(ex.reps) : `${ex.duration}s`}</span>
                          </div>
                          <div className="text-gray-500 text-xs">{ls(ex.detail)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <div className="px-4 pt-2 max-w-lg mx-auto w-full shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
        <button
          onClick={() => { sessionStorage.removeItem('puls_history_saved'); navigate('/workout'); }}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all active:scale-[0.98] bg-violet-600 hover:bg-violet-500"
        >
          {t.startWorkout}
        </button>
      </div>
    </div>
  );
}
