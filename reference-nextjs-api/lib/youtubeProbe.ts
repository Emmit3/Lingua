/**
 * One-shot diagnostics: proves `YOUTUBE_API_KEY` can reach YouTube Data API v3
 * (search.list + videos.list). Used by GET /api/youtube/verify — never returns the key.
 */

export type YoutubeProbeResult = {
  ok: boolean;
  /** Which step failed first, if any. */
  failedStep?: 'search.list' | 'videos.list' | 'config';
  httpStatus?: number;
  /** Google API error message when present. */
  youtubeErrorMessage?: string;
  /** Raw item count from search.list (before videos enrichment). */
  searchItemCount: number;
  /** Items returned from videos.list. */
  videosItemCount: number;
  /** IDs we asked videos.list for (trimmed to YouTube max id length). */
  videoIdsRequested: string[];
  /** First playable-looking short from the same filters as /api/youtube/shorts (duration ≤ 180s, embeddable). */
  sample?: { videoId: string; title: string; durationSeconds: number };
  /** Human-readable hints (quota, API not enabled, etc.). */
  hints: string[];
};

function iso8601DurationToSeconds(iso: string): number {
  if (!iso || iso === 'P0D') return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const s = parseInt(m[3] || '0', 10);
  return h * 3600 + min * 60 + s;
}

const MAX_SHORT_SECONDS = 180;

/**
 * Minimal probe query — must stay hashtag-heavy for Shorts-style discovery.
 */
const PROBE_Q = 'learn spanish #learnspanish #Shorts';

export async function probeYoutubeDataApi(apiKey: string): Promise<YoutubeProbeResult> {
  const hints: string[] = [];
  const key = apiKey.trim();
  if (!key) {
    return {
      ok: false,
      failedStep: 'config',
      searchItemCount: 0,
      videosItemCount: 0,
      videoIdsRequested: [],
      hints: ['YOUTUBE_API_KEY is empty'],
    };
  }

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('videoDuration', 'short');
  searchUrl.searchParams.set('videoEmbeddable', 'true');
  searchUrl.searchParams.set('videoSyndicated', 'true');
  searchUrl.searchParams.set('maxResults', '5');
  searchUrl.searchParams.set('q', PROBE_Q);
  searchUrl.searchParams.set('order', 'relevance');
  searchUrl.searchParams.set('key', key);

  let sRes: Response;
  let sJson: {
    items?: { id?: { videoId?: string } }[];
    error?: { message?: string; errors?: { reason?: string }[] };
  };
  try {
    sRes = await fetch(searchUrl.toString());
    sJson = (await sRes.json()) as typeof sJson;
  } catch (e) {
    return {
      ok: false,
      failedStep: 'search.list',
      searchItemCount: 0,
      videosItemCount: 0,
      videoIdsRequested: [],
      hints: [
        e instanceof Error ? e.message : 'Network error calling search.list',
        'Check outbound HTTPS and DNS from this server.',
      ],
    };
  }

  const searchItems = sJson.items ?? [];
  const searchItemCount = searchItems.length;

  if (!sRes.ok) {
    const msg = sJson.error?.message ?? `HTTP ${sRes.status}`;
    if (/quota|Quota/i.test(msg)) hints.push('YouTube Data API daily quota may be exhausted.');
    if (/API key not valid|invalid/i.test(msg)) hints.push('Key may be wrong or restricted by HTTP referrer / bundle ID.');
    if (/has not been used in project|disabled|API_KEY_SERVICE_DISABLED/i.test(msg)) {
      hints.push('Enable YouTube Data API v3 for the key’s Google Cloud project.');
    }
    return {
      ok: false,
      failedStep: 'search.list',
      httpStatus: sRes.status,
      youtubeErrorMessage: msg,
      searchItemCount,
      videosItemCount: 0,
      videoIdsRequested: [],
      hints,
    };
  }

  const ids = searchItems
    .map((it) => it.id?.videoId)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
    .slice(0, 5);

  if (!ids.length) {
    hints.push('search.list returned no video ids for the probe query — try a different q later.');
    return {
      ok: true,
      searchItemCount,
      videosItemCount: 0,
      videoIdsRequested: [],
      hints,
    };
  }

  const vUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
  vUrl.searchParams.set('part', 'snippet,contentDetails,status');
  vUrl.searchParams.set('id', ids.join(','));
  vUrl.searchParams.set('key', key);

  let vRes: Response;
  let vJson: {
    items?: {
      id: string;
      snippet?: { title?: string };
      contentDetails?: { duration?: string };
      status?: { embeddable?: boolean; uploadStatus?: string };
    }[];
    error?: { message?: string };
  };

  try {
    vRes = await fetch(vUrl.toString());
    vJson = (await vRes.json()) as typeof vJson;
  } catch (e) {
    return {
      ok: false,
      failedStep: 'videos.list',
      searchItemCount,
      videosItemCount: 0,
      videoIdsRequested: ids,
      hints: [e instanceof Error ? e.message : 'Network error calling videos.list'],
    };
  }

  const vItems = vJson.items ?? [];
  const videosItemCount = vItems.length;

  if (!vRes.ok) {
    return {
      ok: false,
      failedStep: 'videos.list',
      httpStatus: vRes.status,
      youtubeErrorMessage: vJson.error?.message ?? `HTTP ${vRes.status}`,
      searchItemCount,
      videosItemCount,
      videoIdsRequested: ids,
      hints,
    };
  }

  let sample: YoutubeProbeResult['sample'];
  for (const row of vItems) {
    const st = row.status;
    if (st?.embeddable === false) continue;
    if (st?.uploadStatus && st.uploadStatus !== 'processed') continue;
    const sec = iso8601DurationToSeconds(row.contentDetails?.duration ?? 'PT0S');
    if (sec <= 0 || sec > MAX_SHORT_SECONDS) continue;
    sample = {
      videoId: row.id,
      title: row.snippet?.title ?? 'Short',
      durationSeconds: sec,
    };
    break;
  }

  if (!sample) {
    hints.push(
      'videos.list succeeded but no item passed Shorts filters (embeddable, ≤3min) — normal for some result sets.',
    );
  }

  return {
    ok: true,
    searchItemCount,
    videosItemCount,
    videoIdsRequested: ids,
    sample,
    hints,
  };
}
