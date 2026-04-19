/**
 * Playful Momentum — shared design tokens (RN StyleSheet + Tailwind mirror).
 */

export const Neutrals = {
  background: '#FAFAF8',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  divider: '#E5E7EB',
} as const;

export const Accents = {
  teal: '#00D9FF',
  coral: '#FF6B54',
  lime: '#A3FF5C',
  purple: '#7C3AED',
} as const;

export type AccentName = keyof typeof Accents;

/** Default accent when language is unknown */
export const defaultAccentHex = Accents.teal;

const LANG_ACCENT: Record<string, AccentName> = {
  es: 'coral',
  fr: 'teal',
  de: 'purple',
  it: 'teal',
  pt: 'coral',
  ja: 'purple',
  zh: 'teal',
  ko: 'coral',
};

/**
 * Resolve a UI accent for a reel: prefer catalog `accentColor`, else language map.
 */
export function accentHexForReel(language: string, accentColor?: string): string {
  if (accentColor && /^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
    return accentColor;
  }
  const key = language.toLowerCase().slice(0, 2);
  const name = LANG_ACCENT[key] ?? 'teal';
  return Accents[name];
}

export const Spacing = {
  s1: 8,
  s2: 16,
  s3: 24,
  s4: 32,
  s5: 40,
  s6: 48,
} as const;

/** Overlay: dark + slight accent tint (spec: not flat gray) */
export function quizDimColor(accentHex: string): string {
  const h = accentHex.replace('#', '');
  if (h.length !== 6) return 'rgba(0,0,0,0.6)';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return 'rgba(0,0,0,0.6)';
  return `rgba(${Math.round(r * 0.15)},${Math.round(g * 0.15)},${Math.round(b * 0.15)},0.72)`;
}

export { AppFont } from '@/constants/appFonts';
