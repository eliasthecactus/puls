import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '@/store/workout';
import { useWorkoutEngine } from '@/hooks/useWorkoutEngine';
import { useT, useLocalStr } from '@/i18n';
import { ProgressBar } from '@/components/ProgressBar';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RepCounter } from '@/components/RepCounter';
import { RestOverlay } from '@/components/RestOverlay';
import { MuscleGroupView, MuscleTagList } from '@/components/MuscleGroupView';
import { EXERCISE_IMAGES } from '@/data/exerciseImages';

function DemoModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative flex flex-col items-center gap-4 animate-scale-in">
        <div className="text-white/80">{children}</div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">Schließen</button>
      </div>
    </div>
  );
}

// Stub plan used when nothing is selected — keeps hook call count stable
const EMPTY_PLAN = { id: '', name: { de: '', en: '' }, subtitle: { de: '', en: '' }, category: '', duration: 0, icon: 'dumbbell' as const, color: ['#000', '#000'] as [string,string], sections: [] };

export function TimerScreen() {
  const navigate = useNavigate();
  const t = useT();
  const ls = useLocalStr();
  const { selectedPlan, intensity } = useWorkoutStore();
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Always call the hook — never conditionally. Use empty plan as fallback.
  const engine = useWorkoutEngine(selectedPlan ?? EMPTY_PLAN, intensity);

  useEffect(() => {
    if (!selectedPlan) navigate('/', { replace: true });
  }, [selectedPlan, navigate]);

  if (!selectedPlan) return null;

  const {
    phase,
    isRunning,
    isPaused,
    currentExercise,
    currentSection,
    timeRemaining,
    restTimeRemaining,
    progressPercent,
    currentRoundIndex,
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
  } = engine;

  useEffect(() => {
    if (phase === 'complete') navigate('/complete', { replace: true });
  }, [phase, navigate]);

  if (phase === 'complete') return null;

  const nextExercise = currentSection?.exercises[engine.currentExerciseIndex + 1];

  const allPrimary = Array.from(new Set(
    selectedPlan.sections.flatMap(s => s.exercises.flatMap(e => e.primaryMuscles))
  ));
  const allSecondary = Array.from(new Set(
    selectedPlan.sections.flatMap(s => s.exercises.flatMap(e => e.secondaryMuscles ?? []))
      .filter(m => !allPrimary.includes(m))
  ));

  // Pre-start screen
  if (!isRunning && !isPaused) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center gap-8">
        <button
          onClick={() => navigate('/start')}
          className="absolute top-4 left-4 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-4">
          <MuscleGroupView primaryMuscles={allPrimary} secondaryMuscles={allSecondary} size={90} side="anterior" />
          <MuscleGroupView primaryMuscles={allPrimary} secondaryMuscles={allSecondary} size={90} side="posterior" />
        </div>

        <div>
          <h1 className="text-white text-3xl font-bold mb-1">{ls(selectedPlan.name)}</h1>
          <p className="text-gray-400 text-sm">{ls(selectedPlan.subtitle)}</p>
        </div>

        <button
          onClick={start}
          className="w-24 h-24 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-violet-500/30 transition-all active:scale-95 hover:scale-105"
        >
          <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <p className="text-gray-500 text-sm">{t.tapToStart}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col select-none">
      {/* Progress bar + abort */}
      <div className="px-4 pt-12 pb-4 bg-gray-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => { if (confirm(t.abortConfirm)) navigate('/'); }}
            className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors shrink-0"
            aria-label="Workout abbrechen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1">
            <ProgressBar
              percent={progressPercent}
              label={currentSection ? ls(currentSection.label) : ''}
              sublabel={t.roundCounter(currentRoundIndex + 1, roundsForCurrentSection)}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-between px-4 py-4 overflow-hidden">
        {/* Exercise info */}
        <div className="text-center w-full max-w-sm">
          <h2 className="text-white text-3xl font-bold mb-1">{currentExercise ? ls(currentExercise.name) : ''}</h2>
          <p className="text-gray-400 text-sm">{currentExercise ? ls(currentExercise.detail) : ''}</p>
        </div>

        {/* Exercise visual */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 gap-3 w-full max-w-sm">
          {currentExercise && (() => {
            const imgUrl = EXERCISE_IMAGES[currentExercise.id];
            return imgUrl ? (
              <div className="w-48 h-48 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                <img
                  src={imgUrl}
                  alt={ls(currentExercise.name)}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <MuscleGroupView
                primaryMuscles={currentExercise.primaryMuscles}
                secondaryMuscles={currentExercise.secondaryMuscles}
                size={170}
              />
            );
          })()}
          {currentExercise && (
            <MuscleTagList
              primary={currentExercise.primaryMuscles}
              secondary={currentExercise.secondaryMuscles}
            />
          )}
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-4">
          <CountdownTimer seconds={timeRemaining} onClick={() => setShowDemoModal(true)} />

          {currentExercise?.reps !== undefined && (
            <RepCounter
              count={repCount}
              target={currentExercise.reps}
              onIncrement={incrementRep}
              onDecrement={decrementRep}
            />
          )}

          {currentExercise?.formTip && (
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 max-w-xs text-center">
              <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 14a1 1 0 100 2 1 1 0 000-2zm0-9a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1z"/>
              </svg>
              <span className="text-gray-300 text-sm">{ls(currentExercise.formTip!)}</span>
            </div>
          )}
        </div>

        {nextExercise && (
          <div className="text-gray-600 text-xs mt-2">
            {t.nextExercise(ls(nextExercise.name))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between w-full max-w-xs mt-4 pb-safe">
          <button
            onClick={prev}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={isPaused ? resume : pause}
            className="w-20 h-20 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/20 transition-all active:scale-95"
          >
            {isPaused ? (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          <button
            onClick={next}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {phase === 'rest' && (
        <RestOverlay
          seconds={restTimeRemaining}
          onSkip={skipRest}
          nextExerciseName={currentSection?.exercises[0] ? ls(currentSection.exercises[0].name) : undefined}
        />
      )}

      {showDemoModal && currentExercise && (
        <DemoModal onClose={() => setShowDemoModal(false)}>
          <div className="flex flex-col items-center gap-4">
            <MuscleGroupView
              primaryMuscles={currentExercise.primaryMuscles}
              secondaryMuscles={currentExercise.secondaryMuscles}
              size={260}
            />
            <div className="text-center">
              <div className="text-white font-bold text-xl mb-1">{ls(currentExercise.name)}</div>
              <div className="text-gray-400 text-sm mb-3">{ls(currentExercise.detail)}</div>
              <MuscleTagList
                primary={currentExercise.primaryMuscles}
                secondary={currentExercise.secondaryMuscles}
              />
              {currentExercise.formTip && (
                <div className="text-gray-300 text-sm bg-white/5 rounded-xl px-4 py-2 mt-3">
                  {ls(currentExercise.formTip)}
                </div>
              )}
            </div>
          </div>
        </DemoModal>
      )}
    </div>
  );
}
