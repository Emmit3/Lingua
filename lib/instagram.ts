/**
 * Instagram Reels via a **server proxy** (Next.js, Cloudflare Worker, etc.).
 * Tokens must never ship in the Expo client — point `EXPO_PUBLIC_IG_PROXY_URL`
 * (or `EXPO_PUBLIC_BACKEND_URL`) at a host that implements:
 *   GET /api/reels/health
 *   GET /api/reels/oembed?url=...
 *   GET /api/reels/hashtag?tag=...&type=recent_media|top_media
 *
 * Reference route implementations: `reference-nextjs-api/` (copy to a Next app).
 */

const proxyBase = () =>
  (process.env.EXPO_PUBLIC_IG_PROXY_URL ?? process.env.EXPO_PUBLIC_BACKEND_URL ?? '').replace(
    /\/$/,
    '',
  );

export type OEmbedData = {
  html?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  title?: string;
};

export type HashtagReel = {
  id: string;
  permalink: string;
  timestamp?: string;
  thumbnail_url?: string;
  media_type: string;
};

export const LANGUAGE_HASHTAGS: Record<string, string[]> = {
  Spanish: ['learnspanish', 'spanishlessons', 'hablaespanol'],
  French: ['learnfrench', 'frenchlessons', 'apprendrefrancais'],
  Japanese: ['learnjapanese', 'japaneselesson', 'nihongo'],
  Mandarin: ['learnmandarin', 'chineselessons', 'learnchinese'],
  German: ['learngerman', 'germanlessons', 'deutschlernen'],
  English: ['learnenglish', 'englishlessons', 'esl'],
  Portuguese: ['learnportuguese', 'portugues'],
  Korean: ['learnkorean', 'koreanlessons', 'hangul'],
};

export function getProxyBase(): string {
  const b = proxyBase();
  if (!b) {
    throw new Error(
      'Set EXPO_PUBLIC_IG_PROXY_URL (or EXPO_PUBLIC_BACKEND_URL) to your API that proxies Instagram.',
    );
  }
  return b;
}

/** Normalize pasted Instagram reel/post links for oEmbed + embed WebView. */
export function normalizeInstagramReelUrl(raw: string): string {
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) {
    u = `https://${u}`;
  }
  try {
    const parsed = new URL(u);
    if (!parsed.hostname.includes('instagram.com')) {
      return u;
    }
    parsed.search = '';
    parsed.hash = '';
    let out = parsed.toString();
    if (out.endsWith('/')) out = out.slice(0, -1);
    return out;
  } catch {
    return raw.trim();
  }
}

export type ProxyHealth = {
  ok: boolean;
  routes?: string[];
  configured?: { instagramAccessToken: boolean; instagramUserId: boolean };
  note?: string;
};

/** Ping the proxy without calling Meta (use to verify EXPO_PUBLIC_IG_PROXY_URL). */
export async function fetchProxyHealth(): Promise<ProxyHealth> {
  const base = getProxyBase();
  const res = await fetch(`${base}/api/reels/health`);
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Health check failed (${res.status}) ${t.slice(0, 120)}`);
  }
  return res.json() as Promise<ProxyHealth>;
}

export async function fetchOEmbed(reelUrl: string): Promise<OEmbedData> {
  const base = getProxyBase();
  const url = normalizeInstagramReelUrl(reelUrl);
  const res = await fetch(`${base}/api/reels/oembed?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`oEmbed failed (${res.status}) ${t.slice(0, 120)}`);
  }
  return res.json() as Promise<OEmbedData>;
}

export async function fetchHashtagReels(
  tag: string,
  type: 'top_media' | 'recent_media' = 'recent_media',
): Promise<HashtagReel[]> {
  const base = getProxyBase();
  const clean = tag.replace(/^#/, '').trim();
  const res = await fetch(
    `${base}/api/reels/hashtag?tag=${encodeURIComponent(clean)}&type=${encodeURIComponent(type)}`,
  );
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Hashtag failed (${res.status}) ${t.slice(0, 120)}`);
  }
  const data = (await res.json()) as { reels?: HashtagReel[]; error?: string };
  if (data.error) throw new Error(data.error);
  return data.reels ?? [];
}

/** Instagram /reel/ID or /p/ID → embed URL for WebView. */
export function instagramPermalinkToEmbedUrl(permalink: string): string {
  const u = permalink.trim().replace(/\/$/, '');
  if (u.endsWith('/embed')) return u;
  return `${u}/embed`;
}
