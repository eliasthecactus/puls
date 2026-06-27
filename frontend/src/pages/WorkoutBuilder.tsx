import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { DbExercise, RefSection } from '@/types';
import { useI18nStore } from '@/store/i18n';
import { useAuthStore } from '@/store/auth';
import { PLANETS, planetLabel } from '@/data/planets';
import { CATEGORIES } from '@/data/categories';
import { computeRefDurationMin } from '@/lib/training';
import { v4 as uuidv4 } from 'uuid';

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function ExercisePicker({ exercises, selected, onSelect, onClose }: {
  exercises: DbExercise[];
  selected: Set<string>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const lang = useI18nStore(s => s.language);
  const [search, setSearch] = useState('');
  const filtered = exercises.filter(e =>
    (lang === 'de' ? e.nameDE : e.nameEN).toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-t-2xl flex flex-col max-h-[80vh]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <input className="input flex-1" placeholder="Search…" autoFocus value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={onClose} className="text-gray-500 hover:text-white shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-1.5">
          {filtered.map(ex => {
            const name = lang === 'de' ? ex.nameDE : ex.nameEN;
            const isSelected = selected.has(ex.id);
            return (
              <button key={ex.id} onClick={() => onSelect(ex.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${isSelected ? 'bg-violet-500/20 border border-violet-500/40' : 'bg-white/5 hover:bg-white/10'}`}>
                <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden shrink-0">
                  {ex.imageUrl
                    ? <img src={ex.imageUrl} alt="" className="w-full h-full object-contain" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">—</div>}
                </div>
                <span className="text-white text-sm">{name}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-violet-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No exercises found.</p>}
        </div>
      </div>
    </div>
  );
}

function SectionEditor({ section, exercises, index, onChange, onDelete }: {
  section: RefSection;
  exercises: DbExercise[];
  index: number;
  onChange: (s: RefSection) => void;
  onDelete: () => void;
}) {
  const lang = useI18nStore(s => s.language);
  const [showPicker, setShowPicker] = useState(false);
  const exMap = useMemo(() => Object.fromEntries(exercises.map(e => [e.id, e])), [exercises]);

  function getName(id: string) {
    const e = exMap[id];
    if (!e) return id;
    return lang === 'de' ? e.nameDE : e.nameEN;
  }

  function addExercise(id: string) {
    if (section.exercises.some(e => e.exerciseId === id)) return;
    onChange({ ...section, exercises: [...section.exercises, { exerciseId: id, duration: 30 }] });
  }
  function removeExercise(idx: number) {
    onChange({ ...section, exercises: section.exercises.filter((_, i) => i !== idx) });
  }
  function setDuration(idx: number, val: number) {
    onChange({ ...section, exercises: section.exercises.map((e, i) => i === idx ? { ...e, duration: val } : e) });
  }

  const selectedIds = new Set(section.exercises.map(e => e.exerciseId));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 bg-violet-500/20 rounded-md flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">{index + 1}</span>
        <input className="input flex-1" placeholder="Block name"
          value={section.label}
          onChange={e => onChange({ ...section, label: e.target.value })} />
        <button onClick={onDelete} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 shrink-0 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs">Rounds</span>
          <input type="number" min={1} max={20} className="input"
            value={section.rounds}
            onChange={e => onChange({ ...section, rounds: parseInt(e.target.value) || 1 })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs">Rest rounds (s)</span>
          <input type="number" min={0} max={600} className="input"
            value={section.restBetweenRounds}
            onChange={e => onChange({ ...section, restBetweenRounds: parseInt(e.target.value) || 0 })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs">Rest after block (s)</span>
          <input type="number" min={0} max={600} className="input"
            value={section.restAfterSection}
            onChange={e => onChange({ ...section, restAfterSection: parseInt(e.target.value) || 0 })} />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        {section.exercises.map((ex, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2">
            <div className="w-7 h-7 rounded-md bg-white/5 overflow-hidden shrink-0">
              {exMap[ex.exerciseId]?.imageUrl
                ? <img src={exMap[ex.exerciseId]!.imageUrl} alt="" className="w-full h-full object-contain" />
                : <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">—</div>}
            </div>
            <span className="text-white text-sm flex-1 truncate">{getName(ex.exerciseId)}</span>
            <input type="number" min={5} max={600} className="input w-16 text-center text-sm py-1"
              value={ex.duration}
              onChange={e => setDuration(idx, parseInt(e.target.value) || 30)} />
            <span className="text-gray-600 text-xs">s</span>
            <button onClick={() => removeExercise(idx)} className="text-gray-600 hover:text-red-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowPicker(true)} className="btn-secondary text-sm">
        + Add exercise
      </button>

      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          selected={selectedIds}
          onSelect={id => { addExercise(id); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

export function WorkoutBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = useI18nStore(s => s.language);
  const isAdmin = useAuthStore(s => s.user?.username === 'elias');

  const systemParam = searchParams.get('system'); // '<id>' | 'new' | null
  const editId = searchParams.get('edit');         // custom plan id | null
  const isSystem = systemParam !== null;
  const systemId = isSystem && systemParam !== 'new' ? systemParam : null;

  const [name, setName] = useState('');             // custom plan name
  const [planetKey, setPlanetKey] = useState('');   // system plan name
  const [subtitle, setSubtitle] = useState('');     // system only
  const [category, setCategory] = useState(CATEGORIES[0].key); // system only
  const [sections, setSections] = useState<RefSection[]>([]);
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [usedPlanetKeys, setUsedPlanetKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const tasks: Promise<unknown>[] = [api.getExercises().then(setExercises)];
    if (isSystem) {
      tasks.push(api.getSystemPlans().then(plans => {
        setUsedPlanetKeys(plans.filter(p => p.id !== systemId).map(p => p.planetKey));
        if (systemId) {
          const plan = plans.find(p => p.id === systemId);
          if (plan) {
            setPlanetKey(plan.planetKey);
            setSubtitle(plan.subtitle);
            setCategory(plan.category);
            setSections(plan.sections);
          }
        }
      }));
    } else if (editId) {
      tasks.push(api.getCustomPlans().then(plans => {
        const plan = plans.find(p => p.id === editId);
        if (plan) { setName(plan.name); setSections(plan.sections); }
      }));
    }
    Promise.all(tasks).finally(() => setLoading(false));
  }, [isSystem, systemId, editId]);

  const availablePlanets = useMemo(
    () => PLANETS.filter(p => p.key === planetKey || !usedPlanetKeys.includes(p.key)),
    [usedPlanetKeys, planetKey]
  );
  const estimatedMin = useMemo(() => sections.length ? computeRefDurationMin(sections) : 0, [sections]);

  function addSection() {
    setSections(prev => [...prev, {
      id: uuidv4(),
      label: `Block ${prev.length + 1}`,
      rounds: 3,
      restBetweenRounds: 60,
      restAfterSection: 90,
      exercises: [],
    }]);
  }
  function updateSection(idx: number, s: RefSection) {
    setSections(prev => prev.map((p, i) => i === idx ? s : p));
  }
  function deleteSection(idx: number) {
    setSections(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (sections.length === 0) { alert('Add at least one block.'); return; }
    if (sections.some(s => s.exercises.length === 0)) { alert('Every block needs at least one exercise.'); return; }
    setSaving(true);
    try {
      if (isSystem) {
        if (!planetKey) { alert('Choose a planet name.'); setSaving(false); return; }
        if (systemId) {
          await api.updateSystemPlan(systemId, { planetKey, subtitle, category, sections });
        } else {
          await api.createSystemPlan({ planetKey, subtitle, category, sections });
        }
        navigate('/admin');
      } else {
        if (!name.trim()) { alert('Please enter a workout name.'); setSaving(false); return; }
        if (editId) {
          await api.updateCustomPlan(editId, { name: name.trim(), sections });
        } else {
          await api.createCustomPlan({ name: name.trim(), sections });
        }
        navigate('/');
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  // Guard: only admins can edit system plans
  if (isSystem && !isAdmin) {
    return (
      <div className="h-dvh bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Access denied.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-dvh bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const title = isSystem
    ? (systemId ? 'Edit Training' : 'New Training')
    : (editId ? 'Edit Workout' : 'Create Workout');

  return (
    <div className="h-dvh bg-gray-950 flex flex-col overflow-hidden">
      <div className="px-4 pb-3 bg-gray-950/95 backdrop-blur-xl border-b border-white/5 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)' }}>
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} />
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-lg leading-tight">{title}</h1>
            {estimatedMin > 0 && <p className="text-gray-500 text-xs">≈ {estimatedMin} min</p>}
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-1.5">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}>
        {isSystem ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-gray-500 text-xs">Planet name</span>
              <select className="input" value={planetKey} onChange={e => setPlanetKey(e.target.value)}>
                <option value="">Choose a planet…</option>
                {availablePlanets.map(p => (
                  <option key={p.key} value={p.key}>{planetLabel(p.key, lang)}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-gray-500 text-xs">Category</span>
                <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{lang === 'de' ? c.de : c.en}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-gray-500 text-xs">Subtitle</span>
                <input className="input" value={subtitle} placeholder="Short description"
                  onChange={e => setSubtitle(e.target.value)} />
              </label>
            </div>
          </div>
        ) : (
          <input
            className="input text-lg font-semibold"
            placeholder="Workout name…"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        {sections.map((s, i) => (
          <SectionEditor key={s.id} section={s} exercises={exercises} index={i}
            onChange={updated => updateSection(i, updated)}
            onDelete={() => deleteSection(i)} />
        ))}

        <button onClick={addSection} className="btn-secondary flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add block
        </button>
      </div>
    </div>
  );
}
