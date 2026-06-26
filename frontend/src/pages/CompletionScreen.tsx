import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '@/store/workout';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { useLocalStr, useT } from '@/i18n';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function CompletionScreen() {
  const navigate = useNavigate();
  const ls = useLocalStr();
  const t = useT();
  const { selectedPlan, intensity, setSelectedPlan } = useWorkoutStore();
  const { user } = useAuthStore();
  const [elapsed] = useState(() => {
    const saved = sessionStorage.getItem('puls_elapsed');
    return saved ? parseFloat(saved) : 0;
  });
  const [saved, setSaved] = useState(() => sessionStorage.getItem('puls_history_saved') === '1');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!selectedPlan || !user || saved) return;
    setSaved(true);
    sessionStorage.setItem('puls_history_saved', '1');
    api.saveHistory({
      workoutId: selectedPlan.id,
      workoutName: ls(selectedPlan.name),
      duration: Math.round(elapsed),
      intensity,
    }).catch(() => {});
    api.getStreak().then((s) => setStreak(s.streak)).catch(() => {});
  }, [selectedPlan, user, elapsed, intensity, saved]);

  useEffect(() => {
    if (!selectedPlan) navigate('/');
  }, [selectedPlan, navigate]);

  function handleShare() {
    const text = `Ich habe gerade "${selectedPlan ? ls(selectedPlan.name) : ''}" mit PULS absolviert! 💪`;
    if (navigator.share) {
      navigator.share({ title: 'PULS Workout', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  if (!selectedPlan) return null;

  const totalExercises = selectedPlan.sections.reduce((s, sec) => s + sec.exercises.length * (intensity === 'intense' ? Math.ceil(sec.rounds * 1.25) : sec.rounds), 0);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-6 animate-slide-up max-w-sm w-full">
        {/* Trophy icon */}
        <div className="w-20 h-20 rounded-3xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <div>
          <h1 className="text-white text-3xl font-bold mb-1">{t.workoutDone}</h1>
          <p className="text-gray-400">{ls(selectedPlan.name)}</p>
        </div>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-3">
          {[
            { label: t.timeLabel, value: formatTime(elapsed) },
            { label: t.exercisesLabel2, value: String(totalExercises) },
            { label: t.blocksLabel2, value: String(selectedPlan.sections.length) },
            { label: t.intensityLabel, value: intensity === 'intense' ? t.intensiveLabel : t.normalLabel },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 rounded-2xl p-4 border border-white/5">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-3 w-full">
            <svg className="w-6 h-6 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 1.515a3 3 0 00-3 0L3 5.845a3 3 0 00-1.5 2.598v7.114a3 3 0 001.5 2.598l7.5 4.33a3 3 0 003 0l7.5-4.33a3 3 0 001.5-2.598V8.443a3 3 0 00-1.5-2.598l-7.5-4.33z" />
            </svg>
            <div className="text-left">
              <div className="text-white font-semibold">{t.streakDays(streak)}</div>
              <div className="text-orange-300/70 text-xs">{t.keepGoing}</div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => { setSelectedPlan(null); navigate('/'); }}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.home}
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/start')}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-2xl transition-all active:scale-[0.98] text-sm"
            >
              {t.startWorkout}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-2xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t.share}
            </button>
          </div>
        </div>

        {!user && (
          <p className="text-gray-600 text-xs">{t.saveProgressHint}</p>
        )}
      </div>
    </div>
  );
}
