import { create } from 'zustand';

/**
 * In-memory onboarding state only (no persist middleware).
 * AsyncStorage + zustand persist was blocking the root route on web (hydration never settled).
 * Re-enable persistence later with a non-blocking pattern if needed.
 */
interface OnboardingState {
  fluencyMonths: number;
  studyMinutes: number;
  notificationsGranted: boolean;
  onboardingComplete: boolean;
  setFluencyMonths: (n: number) => void;
  setStudyMinutes: (n: number) => void;
  setNotificationsGranted: (b: boolean) => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  fluencyMonths: 12,
  studyMinutes: 15,
  notificationsGranted: false,
  onboardingComplete: false,
  setFluencyMonths: (n) => set({ fluencyMonths: n }),
  setStudyMinutes: (n) => set({ studyMinutes: n }),
  setNotificationsGranted: (b) => set({ notificationsGranted: b }),
  completeOnboarding: () => set({ onboardingComplete: true }),
}));
