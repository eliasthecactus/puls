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

  // Aggregate unique muscles across all exercises
  const allPrimary = Array.from(new Set(
    selectedPlan.sections.flatMap(s => s.exercises.flatMap(e => e.primaryMuscles))
  )) as MuscleName[];
  const allSecondary = Array.from(new Set(
    selectedPlan.sections.flatMap(s => s.exercises.flatMap(e => e.secondaryMuscles ?? []))
      .filter(m => !allPrimary.includes(m as MuscleName))
  )) as MuscleName[];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-10 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gray-950">

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(selectedPlan.id)}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          aria-label="Toggle favorite"
        >
          <svg
            className={`w-5 h-5 transition-colors ${favorite ? 'text-red-400 fill-red-400' : 'text-white/70'}`}
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="relative px-6 pt-16 pb-4 max-w-lg mx-auto w-full">
          {/* Name + subtitle */}
          <div className="text-center mb-4">
            <h1 className="text-white text-3xl font-bold mb-1">{ls(selectedPlan.name)}</h1>
            <p className="text-white/60 text-sm">{ls(selectedPlan.subtitle)}</p>
          </div>

          {/* Muscle diagrams */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <MuscleGroupView primaryMuscles={allPrimary} secondaryMuscles={allSecondary} size={130} side="anterior" />
            <MuscleGroupView primaryMuscles={allPrimary} secondaryMuscles={allSecondary} size={130} side="posterior" />
          </div>

          {/* Muscle tags */}
          <div className="mb-5">
            <MuscleTagList primary={allPrimary} secondary={allSecondary} />
          </div>

          {/* Stats row */}
          <div
            className="flex items-center justify-center gap-6 bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10"
          >
            {[
              { label: t.durationLabel, value: `${selectedPlan.duration} Min` },
              { label: t.exercisesLabel, value: String(totalExercises) },
              { label: t.blocksLabel, value: String(selectedPlan.sections.length) },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className={`flex-1 text-center ${i < arr.length - 1 ? 'border-r border-white/10' : ''}`}>
                <div className="text-white text-lg font-bold">{value}</div>
                <div className="text-white/50 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 max-w-lg mx-auto w-full">
        {/* Intensity toggle */}
        <div className="bg-gray-900 rounded-2xl border border-white/5 p-1 flex">
          {(['normal', 'intense'] as WorkoutIntensity[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setIntensity(mode)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                intensity === mode
                  ? mode === 'intense'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-violet-600 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {mode === 'normal' ? t.normalMode : t.intenseMode}
            </button>
          ))}
        </div>

        {intensity === 'intense' && (
          <div className="text-orange-400/80 text-xs bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2 text-center">
            {t.intensiveHint}
          </div>
        )}

        {/* Exercise preview by section */}
        <div>
          <h2 className="text-white font-semibold mb-3">{t.programSection}</h2>
          <div className="space-y-2">
            {selectedPlan.sections.map((section, i) => {
              const rounds = intensity === 'intense' ? intensiveRounds(section.rounds) : section.rounds;
              const isOpen = expandedSection === section.id;

              return (
                <div key={section.id} className="bg-gray-900 rounded-xl border border-white/5 overflow-hidden">
                  {/* Section header — tap to expand */}
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/3 transition-colors"
                    onClick={() => setExpandedSection(isOpen ? null : section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="text-left">
                        <div className="text-white text-sm font-medium">{ls(section.label)}</div>
                        <div className="text-gray-500 text-xs">{t.exercisesCount(section.exercises.length)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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

                  {/* Exercise list */}
                  {isOpen && (
                    <div className="border-t border-white/5">
                      {section.exercises.map((ex, j) => (
                        <div key={ex.id} className={`px-4 py-3 flex items-start gap-3 ${j < section.exercises.length - 1 ? 'border-b border-white/5' : ''}`}>
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gray-500 text-xs shrink-0 mt-0.5">
                            {j + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white text-sm font-medium">{ls(ex.name)}</span>
                              <span className="text-gray-500 text-xs shrink-0">
                                {ex.reps ? t.repsUnit(ex.reps) : `${ex.duration}s`}
                              </span>
                            </div>
                            <div className="text-gray-500 text-xs mb-1.5">{ls(ex.detail)}</div>
                            {ex.primaryMuscles.length > 0 && (
                              <MuscleTagList primary={ex.primaryMuscles} secondary={ex.secondaryMuscles} />
                            )}
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
      </div>

      {/* Start button */}
      <div className="px-4 pb-8 pt-3 max-w-lg mx-auto w-full">
        <button
          onClick={() => { sessionStorage.removeItem('puls_history_saved'); navigate('/workout'); }}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] bg-violet-600 hover:bg-violet-500"
        >
          {t.startWorkout}
        </button>
      </div>
    </div>
  );
}
