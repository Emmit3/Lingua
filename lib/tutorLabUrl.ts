import type { AppLocale } from '@/constants/appLocale';
import { isAppLocale } from '@/constants/appLocale';

export type TutorLabLinkParams = {
  /** Lingua interface locale */
  uiLocale: AppLocale;
  /** Profile “I’m learning” label, e.g. Spanish */
  studyLabel: string;
};

function normalizeBaseUrl(raw: string): string {
  const t = raw.trim().replace(/\/$/, '');
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `http://${t}`;
}

/**
 * HeyGen + Claude tutor lab on `reference-nextjs-api` (`/tutor`).
 * Adds `ui` + `study` query params so the lab matches the learner’s app language and study language.
 */
export function buildTutorLabUrl(params: TutorLabLinkParams): string | null {
  const explicit = process.env.EXPO_PUBLIC_TUTOR_LAB_URL?.trim();
  const fromProxy = (() => {
    const b = (
      process.env.EXPO_PUBLIC_YOUTUBE_PROXY_URL ??
      process.env.EXPO_PUBLIC_BACKEND_URL ??
      ''
    )
      .trim()
      .replace(/\/$/, '');
    return b ? `${b}/tutor` : '';
  })();

  const baseRaw = explicit || fromProxy;
  if (!baseRaw) return null;

  let url: URL;
  try {
    url = new URL(normalizeBaseUrl(baseRaw));
  } catch {
    return null;
  }

  const ui = isAppLocale(params.uiLocale) ? params.uiLocale : 'en';
  url.searchParams.set('ui', ui);
  url.searchParams.set('study', params.studyLabel.trim().slice(0, 120) || 'Spanish');
  return url.toString();
}
