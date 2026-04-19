/**
 * YouTube Shorts via a **server proxy** only — never put `YOUTUBE_API_KEY` in the Expo app.
 *
 * Set `EXPO_PUBLIC_YOUTUBE_PROXY_URL` (or reuse `EXPO_PUBLIC_BACKEND_URL`) to a host that implements:
 *   GET /api/youtube/shorts?q=...&maxResults=...&pageToken=...&language=...&languageLabel=...
 *
 * Reference: `reference-nextjs-api/app/api/youtube/shorts/route.ts`
 */

import { Platform } from 'react-native';

const proxyBaseRaw = () =>
  (process.env.EXPO_PUBLIC_YOUTUBE_PROXY_URL ?? process.env.EXPO_PUBLIC_BACKEND_URL ?? '').trim();

/**
 * Android emulator: `localhost`/`127.0.0.1` points at the emulator itself, not your PC.
 * Map to `10.0.2.2` (host loopback). Physical devices still need your PC's LAN IP in `.env`.
 */
export function normalizeYoutubeProxyBaseForDevice(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  if (!trimmed) return trimmed;
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const u = new URL(withProto);
    if (
      Platform.OS === 'android' &&
      (u.hostname === 'localhost' || u.hostname === '127.0.0.1')
    ) {
      u.hostname = '10.0.2.2';
    }
    return `${u.protocol}//${u.host}`;
  } catch {
    return trimmed;
  }
}

export function getYoutubeProxyBase(): string {
  const b = normalizeYoutubeProxyBaseForDevice(proxyBaseRaw());
  if (!b) {
    throw new Error(
      'Set EXPO_PUBLIC_YOUTUBE_PROXY_URL (or EXPO_PUBLIC_BACKEND_URL) to your API that proxies YouTube Data API v3.',
    );
  }
  return b;
}

export type YoutubeShortsApiItem = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  /** ISO 8601 duration e.g. PT45S */
  duration: string;
  durationSeconds: number;
  /** Present only when the uploader exposes tags (often empty for third-party videos). */
  tags: string[];
  thumbnails?: { default?: { url?: string }; medium?: { url?: string } };
  /**
   * Iframe base from the proxy (`https://www.youtube.com/embed/{id}`).
   * Older proxies may omit this; the client falls back to `/embed/{videoId}`.
   */
  embedUrl?: string;
};

export type YoutubeShortsApiResponse = {
  items: YoutubeShortsApiItem[];
  /** Present when the proxy forwards YouTube `search.list` pagination. */
  nextPageToken?: string | null;
  error?: string;
};

export type FetchYoutubeShortsParams = {
  /** Search query; include hashtags (e.g. `#learnspanish`) — proxy adds `#Shorts` if missing. */
  q: string;
  maxResults?: number;
  /** YouTube `search.list` page token for infinite scroll / more results. */
  pageToken?: string;
  language?: string;
  languageLabel?: string;
};

export type FetchYoutubeShortsResult = {
  items: YoutubeShortsApiItem[];
  nextPageToken: string | null;
};

export async function fetchYoutubeShorts(
  params: FetchYoutubeShortsParams,
): Promise<FetchYoutubeShortsResult> {
  const base = getYoutubeProxyBase();
  const max = Math.min(25, Math.max(1, params.maxResults ?? 12));
  const sp = new URLSearchParams({
    q: params.q,
    maxResults: String(max),
  });
  if (params.pageToken?.trim()) sp.set('pageToken', params.pageToken.trim());
  if (params.language) sp.set('language', params.language);
  if (params.languageLabel) sp.set('languageLabel', params.languageLabel);

  const url = `${base}/api/youtube/shorts?${sp.toString()}`;
  const res = await fetch(url);
  let data: YoutubeShortsApiResponse;
  try {
    data = (await res.json()) as YoutubeShortsApiResponse;
  } catch {
    throw new Error(`YouTube proxy returned non-JSON (${res.status}) — is the server running at ${base}?`);
  }
  if (!res.ok) {
    throw new Error(data.error ?? `YouTube proxy failed (${res.status})`);
  }
  return {
    items: data.items ?? [],
    nextPageToken: data.nextPageToken ?? null,
  };
}
