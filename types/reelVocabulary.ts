/**
 * Words collected from reels the learner has watched (captions tokenized locally).
 */
export type ReelVocabularyEntry = {
  /** Normalized lemma for merging (language-specific lower + strip punctuation). */
  lemma: string;
  /** Surface form shown in UI (first occurrence preferred). */
  surface: string;
  language: string;
  firstSeenAt: number;
  lastSeenAt: number;
  /** How many reels included this lemma (increment per distinct reel view). */
  reelCount: number;
  reelIds: string[];
};
