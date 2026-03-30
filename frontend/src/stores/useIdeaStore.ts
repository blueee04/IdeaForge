import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Idea } from '@/types';

interface IdeaState {
  savedIdeas: Idea[];
  recentIdeas: Idea[];
  
  // Actions
  addIdea: (idea: Idea) => void;
  removeIdea: (id: string) => void;
  setRecentIdeas: (ideas: Idea[]) => void;
  clearIdeas: () => void;
}

export const useIdeaStore = create<IdeaState>()(
  persist(
    (set) => ({
      savedIdeas: [],
      recentIdeas: [],
      
      addIdea: (idea) => 
        set((state) => ({
          savedIdeas: [...state.savedIdeas, idea],
        })),
      
      removeIdea: (id) =>
        set((state) => ({
          savedIdeas: state.savedIdeas.filter((idea) => idea.id !== id),
        })),
      
      setRecentIdeas: (ideas) =>
        set({ recentIdeas: ideas }),
      
      clearIdeas: () =>
        set({ savedIdeas: [], recentIdeas: [] }),
    }),
    {
      name: 'lesage-ideas-storage',
    }
  )
);
