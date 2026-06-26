import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WorkoutPlan, WorkoutIntensity } from '@/types';

interface WorkoutStore {
  plans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  intensity: WorkoutIntensity;
  plansLoading: boolean;
  plansError: string | null;

  setPlans: (plans: WorkoutPlan[]) => void;
  setSelectedPlan: (plan: WorkoutPlan | null) => void;
  setIntensity: (intensity: WorkoutIntensity) => void;
  setPlansLoading: (loading: boolean) => void;
  setPlansError: (error: string | null) => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      plans: [],
      selectedPlan: null,
      intensity: 'normal',
      plansLoading: true,
      plansError: null,

      setPlans: (plans) => set({ plans }),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      setIntensity: (intensity) => set({ intensity }),
      setPlansLoading: (loading) => set({ plansLoading: loading }),
      setPlansError: (error) => set({ plansError: error }),
    }),
    {
      name: 'puls-workout',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedPlan: state.selectedPlan,
        intensity: state.intensity,
      }),
    }
  )
);
