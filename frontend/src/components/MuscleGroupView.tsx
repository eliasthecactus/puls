import Model, { type Muscle, ModelType } from 'react-body-highlighter';
import type { MuscleName } from '@/types';
import { useT } from '@/i18n';

interface Props {
  primaryMuscles: MuscleName[];
  secondaryMuscles?: MuscleName[];
  size?: number;
  /** 'anterior' (front) | 'posterior' (back) | 'auto' */
  side?: 'anterior' | 'posterior' | 'auto';
}

// Muscles primarily visible on the posterior (back) view
const POSTERIOR_MUSCLES = new Set<MuscleName>([
  'upper-back', 'lower-back', 'trapezius', 'back-deltoids', 'gluteal', 'hamstring',
]);

function pickSide(primary: MuscleName[]): 'anterior' | 'posterior' {
  const backCount = primary.filter((m) => POSTERIOR_MUSCLES.has(m)).length;
  return backCount > primary.length - backCount ? 'posterior' : 'anterior';
}

export function MuscleGroupView({ primaryMuscles, secondaryMuscles = [], size = 200, side = 'auto' }: Props) {
  const resolvedSide = side === 'auto' ? pickSide(primaryMuscles) : side;
  const modelType = resolvedSide === 'posterior' ? ModelType.POSTERIOR : ModelType.ANTERIOR;

  const data = [
    { name: 'Primary', muscles: primaryMuscles as Muscle[] },
    ...(secondaryMuscles.length > 0
      ? [{ name: 'Secondary', muscles: secondaryMuscles as Muscle[] }]
      : []),
  ];

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`Trainierte Muskeln: ${primaryMuscles.join(', ')}`}
    >
      <Model
        data={data}
        style={{ width: size * 0.9, height: size * 0.9 }}
        type={modelType}
        highlightedColors={['#7c3aed', '#a78bfa']}
        bodyColor="#1f2937"
      />
    </div>
  );
}

export function MuscleTagList({ primary, secondary }: { primary: MuscleName[]; secondary?: MuscleName[] }) {
  const t = useT();

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {primary.map((m) => (
        <span key={m} className="text-xs bg-violet-500/25 text-violet-300 border border-violet-500/30 rounded-full px-2.5 py-0.5 font-medium">
          {t.muscleNames[m] ?? m}
        </span>
      ))}
      {secondary?.map((m) => (
        <span key={m} className="text-xs bg-white/5 text-gray-400 border border-white/10 rounded-full px-2.5 py-0.5">
          {t.muscleNames[m] ?? m}
        </span>
      ))}
    </div>
  );
}
