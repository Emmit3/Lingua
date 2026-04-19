import { NextRequest, NextResponse } from 'next/server';

import { API_CORS_HEADERS, corsOptions } from '@/lib/cors';

/** YouTube Shorts can be up to 3 minutes; keep vertical-style short window for the feed. */
const MAX_SHORT_SECONDS = 180;

export function OPTIONS() {
  return corsOptions();
}

/** YouTube has no Shorts-only API flag; hashtag `#Shorts` improves discovery with `videoDuration=short`. */
function ensureShortsHashtagInQuery(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return '#languagelearning #Shorts';
  if (/#shorts?\b/i.test(trimmed)) return trimmed;
  return `${trimmed} #Shorts`;
}

function iso8601DurationToSeconds(iso: string): number {
  if (!iso || iso === 'P0D') return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const s = parseInt(m[3] || '0', 10);
  return h * 3600 + min * 60 + s;
}

export async function GET(req: NextRequest) {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: 'Server misconfigured: YOUTUBE_API_KEY', items: [] },
      { status: 500, headers: API_CORS_HEADERS },
    );
  }

  const qRaw = req.nextUrl.searchParams.get('q')?.trim() || 'language learning #Shorts';
  const q = ensureShortsHashtagInQuery(qRaw);
  const pageToken = req.nextUrl.searchParams.get('pageToken')?.trim() || undefined;

  const maxRaw = parseInt(req.nextUrl.searchParams.get('maxResults') || '12', 10);
  const maxResults = Math.min(25, Math.max(1, Number.isFinite(maxRaw) ? maxRaw : 12));

  /** Over-fetch so post-filter (duration, embeddable) can still return up to `maxResults`. */
  const searchCap = Math.min(50, Math.max(24, maxResults * 3));

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('videoDuration', 'short');
  searchUrl.searchParams.set('videoEmbeddable', 'true');
  /** Only videos that can play outside youtube.com (required for iframe/WebView embeds). */
  searchUrl.searchParams.set('videoSyndicated', 'true');
  searchUrl.searchParams.set('maxResults', String(searchCap));
  searchUrl.searchParams.set('q', q);
  searchUrl.searchParams.set('order', 'relevance');
  if (pageToken) searchUrl.searchParams.set('pageToken', pageToken);
  searchUrl.searchParams.set('key', key);

  try {
    const sRes = await fetch(searchUrl.toString());
    const sJson = (await sRes.json()) as {
      items?: { id: { videoId?: string }; snippet?: Record<string, unknown> }[];
      nextPageToken?: string;
      error?: { message?: string };
    };
    if (!sRes.ok) {
      return NextResponse.json(
        {
          error: sJson.error?.message ?? `YouTube search failed (${sRes.status})`,
          items: [],
        },
        { status: 502, headers: API_CORS_HEADERS },
      );
    }

    const rawItems = sJson.items ?? [];
    const ids = rawItems
      .map((it) => it.id?.videoId)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    const nextPageToken = sJson.nextPageToken ?? null;

    if (!ids.length) {
      return NextResponse.json(
        { items: [], nextPageToken },
        { headers: API_CORS_HEADERS },
      );
    }

    const vUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    vUrl.searchParams.set('part', 'snippet,contentDetails,status');
    vUrl.searchParams.set('id', ids.join(','));
    vUrl.searchParams.set('key', key);

    const vRes = await fetch(vUrl.toString());
    const vJson = (await vRes.json()) as {
      items?: {
        id: string;
        snippet?: {
          title?: string;
          description?: string;
          channelTitle?: string;
          tags?: string[];
          thumbnails?: { default?: { url?: string }; medium?: { url?: string } };
        };
        contentDetails?: { duration?: string };
        status?: { embeddable?: boolean; uploadStatus?: string };
      }[];
      error?: { message?: string };
    };

    if (!vRes.ok) {
      return NextResponse.json(
        {
          error: vJson.error?.message ?? `YouTube videos.list failed (${vRes.status})`,
          items: [],
        },
        { status: 502, headers: API_CORS_HEADERS },
      );
    }

    const out: {
      videoId: string;
      title: string;
      description: string;
      channelTitle: string;
      duration: string;
      durationSeconds: number;
      tags: string[];
      thumbnails?: { default?: { url?: string }; medium?: { url?: string } };
      /** Canonical iframe src host/path for this id (query string added by the client). */
      embedUrl: string;
    }[] = [];

    for (const row of vJson.items ?? []) {
      const st = row.status;
      if (st?.embeddable === false) continue;
      if (st?.uploadStatus && st.uploadStatus !== 'processed') continue;

      const durIso = row.contentDetails?.duration ?? 'PT0S';
      const sec = iso8601DurationToSeconds(durIso);
      if (sec <= 0 || sec > MAX_SHORT_SECONDS) continue;

      const sn = row.snippet;
      out.push({
        videoId: row.id,
        title: sn?.title ?? 'Short',
        description: sn?.description ?? '',
        channelTitle: sn?.channelTitle ?? 'YouTube',
        duration: durIso,
        durationSeconds: sec,
        tags: Array.isArray(sn?.tags) ? sn.tags.filter((t): t is string => typeof t === 'string') : [],
        thumbnails: sn?.thumbnails,
        embedUrl: `https://www.youtube.com/embed/${row.id}`,
      });

      if (out.length >= maxResults) break;
    }

    return NextResponse.json({ items: out, nextPageToken }, { headers: API_CORS_HEADERS });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'YouTube proxy error';
    return NextResponse.json({ error: msg, items: [] }, { status: 500, headers: API_CORS_HEADERS });
  }
}
