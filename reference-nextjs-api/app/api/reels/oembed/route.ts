import { NextRequest, NextResponse } from 'next/server';

import { REELS_CORS_HEADERS, corsOptions } from '@/lib/cors';

const GRAPH_VERSION = 'v21.0';

export function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400, headers: REELS_CORS_HEADERS });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'Server misconfigured: INSTAGRAM_ACCESS_TOKEN' },
      { status: 500, headers: REELS_CORS_HEADERS },
    );
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${token}&maxwidth=400&omitscript=true`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `Instagram API error: ${res.status}`, detail: body.slice(0, 500) },
        { status: 502, headers: REELS_CORS_HEADERS },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { headers: REELS_CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch oEmbed' },
      { status: 500, headers: REELS_CORS_HEADERS },
    );
  }
}
