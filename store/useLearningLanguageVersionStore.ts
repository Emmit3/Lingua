import { create } from 'zustand';

/** Bumped when the user changes “language I’m learning” so the feed refetches Shorts. */
export const useLearningLanguageVersionStore = create<{
  version: number;
  bump: () => void;
}>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}));
