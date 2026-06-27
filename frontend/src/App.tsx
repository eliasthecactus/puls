import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { AdminPage } from '@/pages/AdminPage';
import { WorkoutBuilder } from '@/pages/WorkoutBuilder';
import { ResetPage } from '@/pages/ResetPage';
import { StartScreen } from '@/pages/StartScreen';
import { TimerScreen } from '@/pages/TimerScreen';
import { CompletionScreen } from '@/pages/CompletionScreen';
import { SettingsScreen } from '@/pages/SettingsScreen';
import { AuthGate } from '@/components/AuthGate';
import { useAuthStore } from '@/store/auth';
import { api, ApiError } from '@/lib/api';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    api.getMe()
      .then((r) => setUser(r.user))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) setUser(null);
      })
      .finally(() => setLoading(false));
  }, [setUser, setLoading]);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <AuthGate>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<StartScreen />} />
            <Route path="/workout" element={<TimerScreen />} />
            <Route path="/complete" element={<CompletionScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/builder" element={<WorkoutBuilder />} />
            <Route path="/reset" element={<ResetPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthGate>
      </AuthLoader>
    </BrowserRouter>
  );
}
