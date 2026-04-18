import { NextResponse } from 'next/server';

import { REELS_CORS_HEADERS, corsOptions } from '@/lib/cors';

export function OPTIONS() {
  return corsOptions();
}

/**
 * Lightweight ping for the proxy (no Meta call).
 * Use from CI or `node scripts/verify-ig-proxy.mjs`.
 */
export async function GET() {
  const hasToken = Boolean(process.env.INSTAGRAM_ACCESS_TOKEN?.trim());
  const hasUserId = Boolean(process.env.INSTAGRAM_USER_ID?.trim());
  return NextResponse.json(
    {
      ok: true,
      routes: ['/api/reels/health', '/api/reels/oembed', '/api/reels/hashtag'],
      configured: {
        instagramAccessToken: hasToken,
        instagramUserId: hasUserId,
      },
      note: 'oEmbed needs a valid token; hashtag search needs token + IG business user id.',
    },
    { headers: REELS_CORS_HEADERS },
  );
}
