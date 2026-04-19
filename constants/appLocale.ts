export const APP_LOCALES = [
  'en',
  'es',
  'fr',
  'de',
  'ja',
  'pt',
  'ko',
  'zh',
  'it',
  'ru',
  'hi',
] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export function isAppLocale(s: string): s is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(s);
}

/** Native names for the interface language picker */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  pt: 'Português',
  ko: '한국어',
  zh: '中文',
  it: 'Italiano',
  ru: 'Русский',
  hi: 'हिन्दी',
};

/** Flag emoji for each interface locale (best-effort region pairing). */
export const LOCALE_FLAGS: Record<AppLocale, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵',
  pt: '🇵🇹',
  ko: '🇰🇷',
  zh: '🇨🇳',
  it: '🇮🇹',
  ru: '🇷🇺',
  hi: '🇮🇳',
};
