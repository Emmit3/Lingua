export type WordState = 'know' | 'practice_more' | 'show_less';

export type SavedPhrase = {
  id: string;
  text: string;
  /** English gloss when known */
  translation?: string;
  reelId: string;
  language: string;
  createdAt: number;
  srsLevel?: number;
  wordState?: WordState;
};
