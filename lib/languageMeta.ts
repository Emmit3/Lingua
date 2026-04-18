/** BCP-47-ish tags → flag emoji for compact UI (best-effort). */
const FLAGS: Record<string, string> = {
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  ja: '🇯🇵',
  ko: '🇰🇷',
  en: '🇬🇧',
  pt: '🇵🇹',
  zh: '🇨🇳',
  ru: '🇷🇺',
  ar: '🇸🇦',
  hi: '🇮🇳',
};

export function languageFlagEmoji(languageTag: string): string {
  const base = languageTag.split(/[-_]/)[0]?.toLowerCase() ?? '';
  return FLAGS[base] ?? '🌐';
}
