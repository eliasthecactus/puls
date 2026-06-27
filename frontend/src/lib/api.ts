import type { WorkoutPlan, WorkoutHistoryEntry, User, StreakData, DbExercise, CustomPlan, AdminUser } from '@/types';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error || res.statusText);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  // Workouts
  getWorkouts: () => request<WorkoutPlan[]>('/workouts'),
  getWorkout: (id: string) => request<WorkoutPlan>(`/workouts/${id}`),

  // Auth
  getMe: () => request<{ user: User }>('/auth/me'),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  // Auth - WebAuthn (raw fetch for passkey flows)
  startRegistration: (username: string, displayName: string) =>
    request<Record<string, unknown>>('/auth/register/start', {
      method: 'POST',
      body: JSON.stringify({ username, displayName }),
    }),
  finishRegistration: (credential: unknown) =>
    request<{ verified: boolean; user: User }>('/auth/register/finish', {
      method: 'POST',
      body: JSON.stringify(credential),
    }),
  startLogin: (username: string) =>
    request<Record<string, unknown>>('/auth/login/start', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),
  finishLogin: (credential: unknown) =>
    request<{ verified: boolean; user: User }>('/auth/login/finish', {
      method: 'POST',
      body: JSON.stringify(credential),
    }),

  // History
  getHistory: () => request<WorkoutHistoryEntry[]>('/history'),
  saveHistory: (entry: Omit<WorkoutHistoryEntry, 'id' | 'completedAt'>) =>
    request<WorkoutHistoryEntry>('/history', { method: 'POST', body: JSON.stringify(entry) }),
  deleteHistory: (id: string) => request<void>(`/history/${id}`, { method: 'DELETE' }),

  // Exercises
  getExercises: () => request<DbExercise[]>('/exercises'),
  createExercise: (data: Partial<DbExercise>) =>
    request<DbExercise>('/exercises', { method: 'POST', body: JSON.stringify(data) }),
  updateExercise: (id: string, data: Partial<DbExercise>) =>
    request<DbExercise>(`/exercises/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteExercise: (id: string) => request<void>(`/exercises/${id}`, { method: 'DELETE' }),
  uploadExerciseImage: (id: string, file: File) => {
    const form = new FormData();
    form.append('image', file);
    return fetch(`/api/exercises/${id}/image`, { method: 'POST', credentials: 'include', body: form })
      .then(r => r.json() as Promise<DbExercise>);
  },

  // Custom plans
  getCustomPlans: () => request<CustomPlan[]>('/custom-plans'),
  createCustomPlan: (data: { name: string; sections: CustomPlan['sections'] }) =>
    request<CustomPlan>('/custom-plans', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomPlan: (id: string, data: Partial<{ name: string; sections: CustomPlan['sections'] }>) =>
    request<CustomPlan>(`/custom-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustomPlan: (id: string) => request<void>(`/custom-plans/${id}`, { method: 'DELETE' }),

  // Admin
  getAdminUsers: () => request<AdminUser[]>('/admin/users'),
  deleteUser: (id: string) => request<void>(`/admin/users/${id}`, { method: 'DELETE' }),
  generateResetToken: (userId: string) =>
    request<{ token: string; url: string; expiresAt: string }>(`/admin/users/${userId}/reset-token`, { method: 'POST' }),

  // Passkey reset
  validateResetToken: (token: string) => request<{ username: string; displayName: string }>(`/auth/reset/${token}`),
  startPasskeyReset: (token: string) =>
    request<Record<string, unknown>>(`/auth/reset/${token}/start`, { method: 'POST' }),
  finishPasskeyReset: (token: string, credential: unknown) =>
    request<{ verified: boolean; user: User }>(`/auth/reset/${token}/finish`, {
      method: 'POST',
      body: JSON.stringify(credential),
    }),

  // User
  getStreak: () => request<StreakData>('/user/streak'),
  updateProfile: (displayName: string) =>
    request<User>('/user/profile', { method: 'PUT', body: JSON.stringify({ displayName }) }),
};
