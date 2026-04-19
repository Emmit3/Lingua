/**
 * Maps Lingua app locale codes to human-readable names and HeyGen `createStartAvatar.language`
 * (BCP-47 style tags per SDK examples).
 */
/** Native names so Claude clearly matches the learner’s UI language */
const UI_LABEL: Record<string, string> = {
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

const HEYGEN_TAG: Record<string, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ja: 'ja',
  pt: 'pt',
  ko: 'ko',
  zh: 'zh',
  it: 'it',
  ru: 'ru',
  hi: 'hi',
};

export function normalizeUiLocale(raw: string | null | undefined): string {
  const s = (raw ?? 'en').trim().toLowerCase().slice(0, 5);
  const base = s.split('-')[0] ?? 'en';
  return HEYGEN_TAG[base] ? base : 'en';
}

export function interfaceLanguageName(localeCode: string): string {
  const key = normalizeUiLocale(localeCode);
  return UI_LABEL[key] ?? 'English';
}

export function heygenSessionLanguage(localeCode: string): string {
  const key = normalizeUiLocale(localeCode);
  return HEYGEN_TAG[key] ?? 'en';
}
