/**
 * Target language for lessons + YouTube Shorts search personalization.
 *
 * YouTube Data API has no `type=short`; discovery uses **`videoDuration=short`** (under 4 min)
 * plus **hashtag-heavy `q`** (e.g. `#learnspanish #Shorts`). The proxy normalizes `#Shorts`
 * when missing. See `reference-nextjs-api/app/api/youtube/shorts/route.ts`.
 */
export type LearningLanguageOption = {
  code: string;
  label: string;
  /** Broad search stem (spaces OK), combined with `youtubeShortHashtags`. */
  youtubeQuery: string;
  /**
   * Hashtag presets for Shorts-style uploads (API has no dedicated Shorts filter).
   * Typical pattern: `#learn{lang} …` plus `#Shorts` added server-side if absent.
   */
  youtubeShortHashtags: string;
};

export const LEARNING_LANGUAGE_OPTIONS: LearningLanguageOption[] = [
  {
    code: 'es',
    label: 'Spanish',
    youtubeQuery: 'learn spanish',
    youtubeShortHashtags: '#learnspanish #spanishlessons',
  },
  {
    code: 'fr',
    label: 'French',
    youtubeQuery: 'learn french',
    youtubeShortHashtags: '#learnfrench #frenchlessons',
  },
  {
    code: 'de',
    label: 'German',
    youtubeQuery: 'learn german',
    youtubeShortHashtags: '#learngerman #deutschlernen',
  },
  {
    code: 'it',
    label: 'Italian',
    youtubeQuery: 'learn italian',
    youtubeShortHashtags: '#learnitalian #italianlessons',
  },
  {
    code: 'pt',
    label: 'Portuguese',
    youtubeQuery: 'learn portuguese',
    youtubeShortHashtags: '#learnportuguese #portugueselearners',
  },
  {
    code: 'ja',
    label: 'Japanese',
    youtubeQuery: 'learn japanese',
    youtubeShortHashtags: '#learnjapanese #nihongo',
  },
  {
    code: 'ko',
    label: 'Korean',
    youtubeQuery: 'learn korean',
    youtubeShortHashtags: '#learnkorean #koreanlessons',
  },
  {
    code: 'zh',
    label: 'Chinese (Mandarin)',
    youtubeQuery: 'learn mandarin chinese',
    youtubeShortHashtags: '#learnchinese #mandarin',
  },
  {
    code: 'ru',
    label: 'Russian',
    youtubeQuery: 'learn russian',
    youtubeShortHashtags: '#learnrussian #russianlessons',
  },
  {
    code: 'ar',
    label: 'Arabic',
    youtubeQuery: 'learn arabic',
    youtubeShortHashtags: '#learnarabic #arabiclessons',
  },
  {
    code: 'hi',
    label: 'Hindi',
    youtubeQuery: 'learn hindi',
    youtubeShortHashtags: '#learnhindi #hindi',
  },
  {
    code: 'en',
    label: 'English (ESL)',
    youtubeQuery: 'learn english esl',
    youtubeShortHashtags: '#learnenglish #esl',
  },
];

export const DEFAULT_LEARNING_LANGUAGE = LEARNING_LANGUAGE_OPTIONS[0];

export function learningOptionByCode(code: string): LearningLanguageOption | undefined {
  return LEARNING_LANGUAGE_OPTIONS.find((o) => o.code === code);
}
