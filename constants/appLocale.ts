export const APP_LOCALES = ['en', 'es', 'fr', 'de', 'ja'] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export function isAppLocale(s: string): s is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(s);
}

/** Native names for the language picker */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
};
