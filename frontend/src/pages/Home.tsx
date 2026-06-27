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
import { useT, useLocalStr } from '@/i18n';
import { useFavoritesStore } from '@/store/favorites';
import { systemPlanToWorkoutPlan, customPlanToWorkoutPlan, computeDurationMin } from '@/lib/training';
import { categoryFilterClass } from '@/data/categories';
import type { WorkoutHistoryEntry, StreakData, WorkoutPlan, DbExercise } from '@/types';

type DurationBucket = 'all' | 'short' | 'medium' | 'long';
type SortMode = 'default' | 'name' | 'duration' | 'durationDesc';

function planMinutes(p: WorkoutPlan): number {
  return p.duration ?? computeDurationMin(p.sections);
}

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
  const ls = useLocalStr();
  const { plans, plansLoading, plansError, setPlans, setPlansLoading, setPlansError, setSelectedPlan } = useWorkoutStore();
  const { user, setUser } = useAuthStore();

  const { favoriteIds } = useFavoritesStore();
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutPlan[]>([]);

  // Filter / sort state
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [durationBucket, setDurationBucket] = useState<DurationBucket>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const categories = useMemo(() => {
    const seen = new Set<string>();
    plans.forEach(p => p.category && seen.add(p.category));
    return Array.from(seen);
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = plans.filter(p => {
      if (activeFilter && p.category !== activeFilter) return false;
      if (favoritesOnly && !favoriteIds.includes(p.id)) return false;
      if (q && !(ls(p.name).toLowerCase().includes(q) || ls(p.subtitle).toLowerCase().includes(q))) return false;
      if (durationBucket !== 'all') {
        const m = planMinutes(p);
        if (durationBucket === 'short' && m > 15) return false;
        if (durationBucket === 'medium' && (m <= 15 || m > 30)) return false;
        if (durationBucket === 'long' && m <= 30) return false;
      }
      return true;
    });
    if (sortMode === 'name') result = [...result].sort((a, b) => ls(a.name).localeCompare(ls(b.name)));
    else if (sortMode === 'duration') result = [...result].sort((a, b) => planMinutes(a) - planMinutes(b));
    else if (sortMode === 'durationDesc') result = [...result].sort((a, b) => planMinutes(b) - planMinutes(a));
    return result;
  }, [plans, activeFilter, favoritesOnly, favoriteIds, search, durationBucket, sortMode, ls]);

  const favoritePlans = useMemo(
    () => plans.filter(p => favoriteIds.includes(p.id)),
    [plans, favoriteIds]
  );

  const hasActiveFilters = !!search || !!activeFilter || favoritesOnly || durationBucket !== 'all' || sortMode !== 'default';

  // Load everything: exercise pool resolves both system and custom trainings.
  useEffect(() => {
    setPlansLoading(true);
    setHistoryLoading(true);
    Promise.all([
      api.getExercises(),
      api.getSystemPlans(),
      api.getHistory(),
      api.getStreak(),
      api.getCustomPlans(),
    ]).then(([pool, sps, h, s, cps]: [DbExercise[], Awaited<ReturnType<typeof api.getSystemPlans>>, WorkoutHistoryEntry[], StreakData, Awaited<ReturnType<typeof api.getCustomPlans>>]) => {
      setPlans(sps.length > 0 ? sps.map(sp => systemPlanToWorkoutPlan(sp, pool)) : WORKOUT_PLANS);
      setHistory(h);
      setStreak(s);
      setCustomWorkouts(cps.map(cp => customPlanToWorkoutPlan(cp, pool)));
    }).catch(() => {
      setPlans(WORKOUT_PLANS);
    }).finally(() => {
      setPlansLoading(false);
      setHistoryLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await api.logout().catch(() => {});
    setUser(null);
  }

  function retryPlans() {
    setPlansError(null);
    setPlansLoading(true);
    api.getSystemPlans()
      .then(async sps => {
        const pool = await api.getExercises();
        setPlans(sps.length > 0 ? sps.map(sp => systemPlanToWorkoutPlan(sp, pool)) : WORKOUT_PLANS);
      })
      .catch((e) => setPlansError(e.message))
      .finally(() => setPlansLoading(false));
  }

  function clearFilters() {
    setSearch(''); setActiveFilter(null); setFavoritesOnly(false);
    setDurationBucket('all'); setSortMode('default');
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-safe">
      {/* Header */}
      <header
        className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-xl border-b border-white/5 px-4 pb-3"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0.75rem)' }}
      >
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
          {customWorkouts.length === 0 ? (
            <button onClick={() => navigate('/builder')}
              className="w-full border-2 border-dashed border-white/10 rounded-2xl py-8 flex flex-col items-center gap-2 text-gray-600 hover:border-violet-500/40 hover:text-violet-400 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">Create your first workout</span>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customWorkouts.map(plan => (
                <div key={plan.id}
                  className="group bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 transition-colors cursor-pointer"
                  onClick={() => { setSelectedPlan(plan); navigate('/start'); }}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-white font-semibold text-sm leading-snug">{ls(plan.name)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/builder?edit=${plan.id}`); }}
                      className="shrink-0 text-gray-500 hover:text-violet-400 transition-colors"
                      aria-label="Edit workout"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.172-8.172z" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {planMinutes(plan)} min · {plan.sections.length} block{plan.sections.length !== 1 ? 's' : ''} · {plan.sections.reduce((sum, s) => sum + s.exercises.length, 0)} exercises
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
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-gray-500 hover:text-white text-xs transition-colors">
                {t.clearFilters}
              </button>
            )}
          </div>

          {!plansLoading && (
            <div className="flex flex-col gap-3 mb-4">
              {/* Search + sort */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="input pl-9"
                  />
                </div>
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value as SortMode)}
                  className="input w-auto"
                  aria-label={t.sortLabel}
                >
                  <option value="default">{t.sortDefault}</option>
                  <option value="name">{t.sortName}</option>
                  <option value="duration">{t.sortDurationAsc}</option>
                  <option value="durationDesc">{t.sortDurationDesc}</option>
                </select>
              </div>

              {/* Category chips + favorites */}
              {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      activeFilter === null ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t.filterAll}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        activeFilter === cat ? categoryFilterClass(cat) : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {t.categories[cat] ?? cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setFavoritesOnly(v => !v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      favoritesOnly ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-3 h-3" fill={favoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {t.favoritesSection}
                  </button>
                </div>
              )}

              {/* Duration buckets */}
              <div className="flex gap-2 flex-wrap">
                {([
                  ['all', t.durationAll],
                  ['short', t.durationShort],
                  ['medium', t.durationMedium],
                  ['long', t.durationLong],
                ] as [DurationBucket, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setDurationBucket(key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      durationBucket === key ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
          ) : !plansLoading && filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm mb-3">{t.noResults}</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-violet-400 text-sm hover:text-violet-300">
                  {t.clearFilters}
                </button>
              )}
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
