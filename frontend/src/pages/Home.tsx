import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutCard } from '@/components/WorkoutCard';
import { HistoryList } from '@/components/HistoryList';
import { StreakBadge } from '@/components/StreakBadge';
import { useWorkoutStore } from '@/store/workout';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { WORKOUT_PLANS } from '@/data/workouts';
import { PulsLogo } from '@/components/PulsLogo';
import { useT } from '@/i18n';
import { useFavoritesStore } from '@/store/favorites';
import type { WorkoutHistoryEntry, StreakData, CustomPlan } from '@/types';

const categoryFilterColors: Record<string, string> = {
  Kraft: 'bg-violet-600 text-white',
  Core: 'bg-emerald-600 text-white',
  HIIT: 'bg-yellow-500 text-black',
  Mobilität: 'bg-pink-600 text-white',
};

function WorkoutCardSkeleton() {
  return (
    <div className="rounded-2xl bg-gray-900 border border-white/5 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-800" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const t = useT();
  const { plans, plansLoading, plansError, setPlans, setPlansLoading, setPlansError, setSelectedPlan } = useWorkoutStore();
  const { user, setUser } = useAuthStore();

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { favoriteIds } = useFavoritesStore();
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [customPlans, setCustomPlans] = useState<CustomPlan[]>([]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    plans.forEach(p => seen.add(p.category));
    return Array.from(seen);
  }, [plans]);

  const filteredPlans = useMemo(
    () => activeFilter ? plans.filter(p => p.category === activeFilter) : plans,
    [plans, activeFilter]
  );

  const favoritePlans = useMemo(
    () => plans.filter(p => favoriteIds.includes(p.id)),
    [plans, favoriteIds]
  );

  // Workout plans are static app content — always use bundled data
  useEffect(() => {
    setPlans(WORKOUT_PLANS);
    setPlansLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch history & streak — user is always present (auth-gated)
  useEffect(() => {
    setHistoryLoading(true);
    Promise.all([
      api.getHistory(),
      api.getStreak(),
      api.getCustomPlans(),
    ]).then(([h, s, cp]) => {
      setHistory(h);
      setStreak(s);
      setCustomPlans(cp);
    }).catch(() => {}).finally(() => setHistoryLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await api.logout().catch(() => {});
    setUser(null);
  }

  function retryPlans() {
    setPlansError(null);
    setPlansLoading(true);
    api.getWorkouts().then(setPlans).catch((e) => setPlansError(e.message)).finally(() => setPlansLoading(false));
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <PulsLogo size={28} />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden sm:block">{user?.displayName}</span>
            {user?.username === 'elias' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                title="Admin"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => navigate('/settings')}
              className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              aria-label={t.settings}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Hero */}
        <div className="animate-fade-in">
          <h1 className="text-white text-3xl font-bold mb-1">
            Hey, {user?.displayName.split(' ')[0]}
          </h1>
          <p className="text-gray-400">{t.readySubtitle}</p>
        </div>

        {/* Streak */}
        {!historyLoading && streak && streak.streak > 0 && (
          <div className="animate-slide-up">
            <StreakBadge streak={streak.streak} totalWorkouts={streak.totalWorkouts} />
          </div>
        )}

        {/* Favorites */}
        {favoritePlans.length > 0 && (
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">{t.favoritesSection}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritePlans.map((plan) => (
                <WorkoutCard
                  key={plan.id}
                  plan={plan}
                  onClick={() => { setSelectedPlan(plan); navigate('/start'); }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Custom plans */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">My Workouts</h2>
            <button onClick={() => navigate('/builder')}
              className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
          </div>
          {customPlans.length === 0 ? (
            <button onClick={() => navigate('/builder')}
              className="w-full border-2 border-dashed border-white/10 rounded-2xl py-8 flex flex-col items-center gap-2 text-gray-600 hover:border-violet-500/40 hover:text-violet-400 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">Create your first workout</span>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customPlans.map(plan => (
                <div key={plan.id}
                  className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 transition-colors cursor-pointer"
                  onClick={() => navigate(`/builder?edit=${plan.id}`)}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-white font-semibold text-sm leading-snug">{plan.name}</span>
                    <span className="text-gray-500 text-xs shrink-0">{plan.sections.length} block{plan.sections.length !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {plan.sections.reduce((sum, s) => sum + s.exercises.length, 0)} exercises
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Workout Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">{t.workoutsSection}</h2>
          </div>
          {!plansLoading && categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeFilter === null
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t.filterAll}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeFilter === cat
                      ? categoryFilterColors[cat] ?? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t.categories[cat] ?? cat}
                </button>
              ))}
            </div>
          )}
          {plansError ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-sm mb-3">{plansError}</p>
              <button onClick={retryPlans} className="text-violet-400 text-sm hover:text-violet-300">
                {t.retry}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plansLoading
                ? Array.from({ length: 6 }).map((_, i) => <WorkoutCardSkeleton key={i} />)
                : filteredPlans.map((plan) => (
                    <WorkoutCard
                      key={plan.id}
                      plan={plan}
                      onClick={() => {
                        setSelectedPlan(plan);
                        navigate('/start');
                      }}
                    />
                  ))}
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">{t.recentWorkouts}</h2>
            {history.length > 3 && (
              <span className="text-gray-500 text-sm">{t.totalCount(history.length)}</span>
            )}
          </div>
          {historyLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-gray-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <HistoryList entries={history} limit={5} />
          )}
        </section>
      </main>
    </div>
  );
}
