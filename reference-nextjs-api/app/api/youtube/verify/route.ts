import { NextResponse } from 'next/server';

import { API_CORS_HEADERS, corsOptions } from '@/lib/cors';
import { probeYoutubeDataApi } from '@/lib/youtubeProbe';

export function OPTIONS() {
  return corsOptions();
}

/**
 * GET /api/youtube/verify
 *
 * Performs a real search.list + videos.list against Google using `YOUTUBE_API_KEY`.
 * For production, restrict access (this consumes API quota).
 */
export async function GET() {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error: 'YOUTUBE_API_KEY is not set',
        probe: null,
      },
      { status: 500, headers: API_CORS_HEADERS },
    );
  }

  const probe = await probeYoutubeDataApi(key);
  const status = probe.ok ? 200 : probe.failedStep === 'config' ? 500 : 502;

  return NextResponse.json(
    {
      ok: probe.ok,
      service: 'youtube-data-api-v3',
      probe,
      note: 'Does not return your API key. Each call uses YouTube quota.',
    },
    { status, headers: API_CORS_HEADERS },
  );
}
