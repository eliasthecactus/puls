import { useMemo } from 'react';
import Model, { type Muscle, ModelType } from 'react-body-highlighter';
import type { WorkoutPlan, MuscleName } from '@/types';
import { useT, useLocalStr } from '@/i18n';
import { useFavoritesStore } from '@/store/favorites';
import { computeDurationMin } from '@/lib/training';
import { categoryChipClass } from '@/data/categories';

interface Props {
  plan: WorkoutPlan;
  onClick: () => void;
}

export function WorkoutCard({ plan, onClick }: Props) {
  const t = useT();
  const ls = useLocalStr();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(plan.id);
  const totalExercises = plan.sections.reduce((sum, s) => sum + s.exercises.length, 0);
  const durationMin = plan.duration ?? computeDurationMin(plan.sections);

  const { primaryMuscles, secondaryMuscles } = useMemo(() => {
    const primary = Array.from(new Set(
      plan.sections.flatMap(s => s.exercises.flatMap(e => e.primaryMuscles))
    )) as MuscleName[];
    const secondary = Array.from(new Set(
      plan.sections.flatMap(s => s.exercises.flatMap(e => e.secondaryMuscles ?? []))
        .filter(m => !primary.includes(m as MuscleName))
    )) as MuscleName[];
    return { primaryMuscles: primary, secondaryMuscles: secondary };
  }, [plan]);

  const muscleData = [
    { name: 'Primary', muscles: primaryMuscles as Muscle[] },
    ...(secondaryMuscles.length > 0 ? [{ name: 'Secondary', muscles: secondaryMuscles as Muscle[] }] : []),
  ];

  const modelStyle = { width: 72, height: 72 };

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/5 text-left transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {/* Header — muscle diagrams */}
      <div className="h-36 relative overflow-hidden flex items-center justify-center bg-gray-950">
        {/* Anterior + posterior views */}
        <div className="relative z-10 flex items-center justify-center gap-4">
          <Model
            data={muscleData}
            style={modelStyle}
            type={ModelType.ANTERIOR}
            highlightedColors={['#7c3aed', '#a78bfa']}
            bodyColor="#1e293b"
          />
          <Model
            data={muscleData}
            style={modelStyle}
            type={ModelType.POSTERIOR}
            highlightedColors={['#7c3aed', '#a78bfa']}
            bodyColor="#1e293b"
          />
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.id); }}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          aria-label="Toggle favorite"
        >
          <svg
            className={`w-4 h-4 transition-colors ${favorite ? 'text-red-400 fill-red-400' : 'text-gray-500'}`}
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="absolute bottom-2 right-3 text-gray-500 text-xs font-medium z-10">
          {durationMin} Min
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-bold text-xl leading-tight tracking-wide">{ls(plan.name)}</h3>
          {plan.category && (
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${categoryChipClass(plan.category)}`}>
              {t.categories[plan.category] ?? plan.category}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-3 h-10 overflow-hidden line-clamp-2">{ls(plan.subtitle)}</p>

        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t.exercisesCount(totalExercises)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {t.blocksCount(plan.sections.length)}
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
