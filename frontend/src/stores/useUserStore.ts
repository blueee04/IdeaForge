import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  role: 'seeker' | 'mentor';
  field?: string;
  fields?: string[];
  noveltyLevel?: number;
  interests?: string[];
}

interface UserState {
  user: any | null;
  preferences: UserPreferences | null;
  hasCompletedOnboarding: boolean;
  
  // Actions
  setUser: (user: any) => void;
  setPreferences: (prefs: UserPreferences) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      preferences: null,
      hasCompletedOnboarding: false,
      
      setUser: (user) =>
        set({ user }),
      
      setPreferences: (prefs) =>
        set({ preferences: prefs, hasCompletedOnboarding: true }),
      
      clearUser: () =>
        set({ user: null, preferences: null, hasCompletedOnboarding: false }),
    }),
    {
      name: 'lesage-user-storage',
    }
  )
);
