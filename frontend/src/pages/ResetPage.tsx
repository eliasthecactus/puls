import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { startRegistration } from '@simplewebauthn/browser';

type Phase = 'loading' | 'ready' | 'error' | 'done';

export function ResetPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const setUser = useAuthStore(s => s.setUser);

  const [phase, setPhase] = useState<Phase>('loading');
  const [userInfo, setUserInfo] = useState<{ username: string; displayName: string } | null>(null);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!token) { setPhase('error'); setError('No reset token provided.'); return; }
    api.validateResetToken(token)
      .then(info => { setUserInfo(info); setPhase('ready'); })
      .catch(() => { setPhase('error'); setError('This reset link is invalid or has already been used.'); });
  }, [token]);

  async function handleRegister() {
    if (!token) return;
    setRegistering(true);
    try {
      const options = await api.startPasskeyReset(token);
      const credential = await startRegistration(options as unknown as any);
      const result = await api.finishPasskeyReset(token, credential);
      if (result.verified) {
        setUser(result.user);
        setPhase('done');
      }
    } catch (e: any) {
      setError(e?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  }

  if (phase === 'loading') {
    return (
      <div className="h-dvh bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="h-dvh bg-gray-950 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-white font-semibold">Invalid link</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-2">Go home</button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="h-dvh bg-gray-950 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold">Passkey added successfully</p>
        <p className="text-gray-400 text-sm">You can now use this device to sign in.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-2">Continue</button>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-gray-950 flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}>
      <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center">
        <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <div>
        <h1 className="text-white font-bold text-xl">Add new passkey</h1>
        <p className="text-gray-400 text-sm mt-1">For account <span className="text-white">@{userInfo?.username}</span></p>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button onClick={handleRegister} disabled={registering} className="btn-primary w-full max-w-xs">
        {registering ? 'Registering…' : 'Register this device'}
      </button>
    </div>
  );
}
