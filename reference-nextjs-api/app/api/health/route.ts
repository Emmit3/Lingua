import { NextResponse } from 'next/server';

import { API_CORS_HEADERS, corsOptions } from '@/lib/cors';

export function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      routes: ['/api/health', '/api/youtube/verify', '/api/youtube/shorts'],
      configured: {
        youtubeApiKey: Boolean(process.env.YOUTUBE_API_KEY?.trim()),
      },
      note: 'Add YOUTUBE_API_KEY (Google Cloud → YouTube Data API v3). Never expose it in the Expo client.',
    },
    { headers: API_CORS_HEADERS },
  );
}
