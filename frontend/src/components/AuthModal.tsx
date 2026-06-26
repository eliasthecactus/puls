import { useState } from 'react';
import { registerPasskey, loginPasskey } from '@/lib/webauthn';
import { useAuthStore } from '@/store/auth';

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = tab === 'register'
        ? await registerPasskey(username.trim(), displayName.trim())
        : await loginPasskey(username.trim());
      setUser(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-gray-900 rounded-3xl border border-white/10 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔑</span>
              <span className="text-white font-bold text-lg">Passkey Anmeldung</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-5">
            Kein Passwort nötig. Melde dich sicher mit deinem Fingerabdruck oder Gesicht an.
          </p>

          {/* Tab switcher */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-5">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-3">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Benutzername</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="z.B. max_muster"
              autoComplete="username"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Anzeigename</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="z.B. Max Muster"
                autoComplete="name"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || (tab === 'register' && !displayName.trim())}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Warte auf Passkey...
              </>
            ) : (
              <>
                <span>🔑</span>
                {tab === 'login' ? 'Anmelden' : 'Konto erstellen'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
