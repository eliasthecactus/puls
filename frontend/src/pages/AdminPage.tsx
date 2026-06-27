import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { DbExercise, AdminUser, SystemPlan } from '@/types';
import { useAuthStore } from '@/store/auth';

type Tab = 'exercises' | 'trainings' | 'users';

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

// ── Exercise management ─────────────────────────────────────────────────────

function ExerciseRow({ ex, onEdit, onDelete }: { ex: DbExercise; onEdit: (e: DbExercise) => void; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 hover:bg-white/8 rounded-xl px-4 py-3 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
        {ex.imageUrl
          ? <img src={ex.imageUrl} alt="" className="w-full h-full object-contain" />
          : <span className="text-gray-600 text-xs">—</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{ex.nameEN}</div>
        <div className="text-gray-500 text-xs truncate">{ex.nameDE} · {ex.duration}s · {ex.primaryMuscles.slice(0,2).join(', ')}</div>
      </div>
      <button onClick={() => onEdit(ex)} className="w-8 h-8 bg-white/5 hover:bg-violet-500/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-400 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button onClick={() => onDelete(ex.id)} className="w-8 h-8 bg-white/5 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function ExerciseModal({ exercise, onSave, onClose }: {
  exercise: Partial<DbExercise> | null;
  onSave: (data: Partial<DbExercise>, imageFile: File | null) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<DbExercise>>(exercise ?? { duration: 30, primaryMuscles: [], secondaryMuscles: [] });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(exercise?.imageUrl ?? null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form, imageFile);
    setSaving(false);
  }

  function field(key: keyof DbExercise) {
    return {
      value: (form[key] as string) ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">{exercise?.id ? 'Edit Exercise' : 'New Exercise'}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Name (EN)</span>
            <input required className="input" {...field('nameEN')} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Name (DE)</span>
            <input required className="input" {...field('nameDE')} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Detail (EN)</span>
            <input className="input" {...field('detailEN')} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Detail (DE)</span>
            <input className="input" {...field('detailDE')} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Form Tip (EN)</span>
            <input className="input" {...field('formTipEN')} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Form Tip (DE)</span>
            <input className="input" {...field('formTipDE')} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Duration (s)</span>
            <input type="number" min={5} max={300} className="input"
              value={form.duration ?? 30}
              onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 30 }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Primary Muscles (comma-sep)</span>
            <input className="input"
              value={(form.primaryMuscles ?? []).join(', ')}
              onChange={e => setForm(f => ({ ...f, primaryMuscles: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
          </label>
          <label className="col-span-2 flex flex-col gap-1">
            <span className="text-gray-400 text-xs">Secondary Muscles (comma-sep)</span>
            <input className="input"
              value={(form.secondaryMuscles ?? []).join(', ')}
              onChange={e => setForm(f => ({ ...f, secondaryMuscles: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary text-sm">
            {imagePreview ? 'Change image' : 'Upload image'}
          </button>
          {imagePreview && (
            <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden">
              <img src={imagePreview} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*,.gif" className="hidden" onChange={handleImage} />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}

function ExercisesTab() {
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<DbExercise> | null | undefined>(undefined);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getExercises().then(setExercises).finally(() => setLoading(false));
  }, []);

  async function handleSave(data: Partial<DbExercise>, imageFile: File | null) {
    let saved: DbExercise;
    if (data.id) {
      saved = await api.updateExercise(data.id, data);
    } else {
      saved = await api.createExercise(data);
    }
    if (imageFile) {
      saved = await api.uploadExerciseImage(saved.id, imageFile);
    }
    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === saved.id);
      return idx >= 0 ? prev.map((e, i) => i === idx ? saved : e) : [saved, ...prev];
    });
    setEditing(undefined);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this exercise?')) return;
    await api.deleteExercise(id);
    setExercises(prev => prev.filter(e => e.id !== id));
  }

  const filtered = exercises.filter(e =>
    e.nameEN.toLowerCase().includes(search.toLowerCase()) ||
    e.nameDE.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-gray-500 text-center py-12">Loading…</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          className="input flex-1"
          placeholder="Search exercises…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setEditing({})} className="btn-primary shrink-0">+ New</button>
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map(ex => (
          <ExerciseRow key={ex.id} ex={ex} onEdit={e => setEditing(e)} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No exercises found.</p>}
      </div>
      {editing !== undefined && (
        <ExerciseModal
          exercise={editing}
          onSave={handleSave}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}

// ── User management ─────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetResult, setResetResult] = useState<{ url: string; expiresAt: string } | null>(null);

  useEffect(() => {
    api.getAdminUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  async function handleReset(id: string) {
    const result = await api.generateResetToken(id);
    setResetResult({ url: result.url, expiresAt: result.expiresAt });
  }

  async function handleDelete(id: string, username: string) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    await api.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  function fmt(date: string | null) {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  if (loading) return <div className="text-gray-500 text-center py-12">Loading…</div>;

  return (
    <div className="flex flex-col gap-4">
      {resetResult && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-violet-300 text-sm font-medium">Reset URL generated</span>
            <button onClick={() => setResetResult(null)} className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(resetResult.url)}
            className="text-left font-mono text-xs text-violet-200 bg-black/30 rounded-lg px-3 py-2 break-all hover:bg-black/50 transition-colors"
          >
            {resetResult.url}
          </button>
          <span className="text-gray-500 text-xs">Expires: {fmt(resetResult.expiresAt)}</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {users.map(u => (
          <div key={u.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
              {u.displayName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{u.displayName} <span className="text-gray-500 text-xs">@{u.username}</span></div>
              <div className="text-gray-500 text-xs">Last active: {fmt(u.lastActiveAt)} · {u.workoutCount} workouts · {u.credentialCount} passkeys</div>
            </div>
            <button onClick={() => handleReset(u.id)} title="Generate passkey reset URL"
              className="w-8 h-8 bg-white/5 hover:bg-violet-500/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-400 transition-colors shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </button>
            <button onClick={() => handleDelete(u.id, u.username)} title="Delete user"
              className="w-8 h-8 bg-white/5 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="text-gray-500 text-center py-8">No users found.</p>}
      </div>
    </div>
  );
}

// ── System Plans Tab ─────────────────────────────────────────────────────────

function SystemPlanRow({ plan, onEdit, onDelete }: { plan: SystemPlan; onEdit: () => void; onDelete: () => void }) {
  const nameDE = (plan.name as any)?.de ?? '';
  const nameEN = (plan.name as any)?.en ?? '';
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{nameDE} / {nameEN}</p>
        <p className="text-gray-500 text-xs">{plan.category} · {plan.duration} min · {(plan.sections as any[]).length} blocks</p>
      </div>
      <button onClick={onEdit} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.172-8.172z" />
        </svg>
      </button>
      <button onClick={onDelete} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function SystemPlanModal({ plan, onSave, onClose }: { plan: SystemPlan; onSave: (p: SystemPlan) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    nameDE: (plan.name as any)?.de ?? '',
    nameEN: (plan.name as any)?.en ?? '',
    subtitleDE: (plan.subtitle as any)?.de ?? '',
    subtitleEN: (plan.subtitle as any)?.en ?? '',
    category: plan.category,
    duration: plan.duration,
    icon: plan.icon,
    sortOrder: plan.sortOrder,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const updated = await api.updateSystemPlan(plan.id, {
        name: { de: form.nameDE, en: form.nameEN },
        subtitle: { de: form.subtitleDE, en: form.subtitleEN },
        category: form.category,
        duration: form.duration,
        icon: form.icon,
        sortOrder: form.sortOrder,
      });
      onSave(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-t-3xl px-4 pt-5 pb-8 flex flex-col gap-4 animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-bold text-lg">Edit Training</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Name DE</span>
            <input className="input" value={form.nameDE} onChange={e => setForm(f => ({ ...f, nameDE: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Name EN</span>
            <input className="input" value={form.nameEN} onChange={e => setForm(f => ({ ...f, nameEN: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Subtitle DE</span>
            <input className="input" value={form.subtitleDE} onChange={e => setForm(f => ({ ...f, subtitleDE: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Subtitle EN</span>
            <input className="input" value={form.subtitleEN} onChange={e => setForm(f => ({ ...f, subtitleEN: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Category</span>
            <input className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Duration (min)</span>
            <input type="number" className="input" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 1 }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Icon</span>
            <input className="input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Sort Order</span>
            <input type="number" className="input" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
          </label>
        </div>

        <div className="flex gap-2 mt-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

function SystemPlansTab() {
  const [plans, setPlans] = useState<SystemPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SystemPlan | null>(null);

  useEffect(() => {
    api.getSystemPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  async function deletePlan(id: string) {
    if (!confirm('Delete this training plan?')) return;
    await api.deleteSystemPlan(id);
    setPlans(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <p className="text-gray-500 text-center py-12">Loading…</p>;

  return (
    <div className="flex flex-col gap-2">
      {plans.map(plan => (
        <SystemPlanRow
          key={plan.id}
          plan={plan}
          onEdit={() => setEditing(plan)}
          onDelete={() => deletePlan(plan.id)}
        />
      ))}
      {plans.length === 0 && <p className="text-gray-500 text-center py-8">No system plans found.</p>}

      {editing && (
        <SystemPlanModal
          plan={editing}
          onSave={updated => { setPlans(prev => prev.map(p => p.id === updated.id ? updated : p)); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export function AdminPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [tab, setTab] = useState<Tab>('exercises');

  if (user?.username !== 'elias') {
    return (
      <div className="h-dvh bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-gray-950 flex flex-col overflow-hidden">
      <div className="px-4 pb-3 bg-gray-950/95 backdrop-blur-xl border-b border-white/5 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)' }}>
        <div className="flex items-center gap-3 mb-3">
          <BackButton onClick={() => navigate(-1)} />
          <h1 className="text-white font-bold text-lg">Admin</h1>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(['exercises', 'trainings', 'users'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'exercises' && <ExercisesTab />}
        {tab === 'trainings' && <SystemPlansTab />}
        {tab === 'users' && <UsersTab />}
      </div>
    </div>
  );
}
