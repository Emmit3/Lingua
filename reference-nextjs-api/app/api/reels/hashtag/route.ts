import { NextRequest, NextResponse } from 'next/server';

import { REELS_CORS_HEADERS, corsOptions } from '@/lib/cors';

const GRAPH_VERSION = 'v21.0';

export function OPTIONS() {
  return corsOptions();
}

function isShortFormVideo(mediaType: string | undefined): boolean {
  return mediaType === 'VIDEO' || mediaType === 'REELS';
}
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

async function getHashtagId(tag: string): Promise<string> {
  if (!IG_USER_ID || !ACCESS_TOKEN) {
    throw new Error('Missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN');
  }
  const u = `https://graph.facebook.com/${GRAPH_VERSION}/ig_hashtag_search?user_id=${IG_USER_ID}&q=${encodeURIComponent(tag)}&access_token=${ACCESS_TOKEN}`;
  const res = await fetch(u);
  const data = (await res.json()) as { data?: { id: string }[]; error?: { message?: string } };
  if (!res.ok) {
    throw new Error(data.error?.message ?? `Hashtag search failed: ${res.status}`);
  }
  const id = data.data?.[0]?.id;
  if (!id) throw new Error('Hashtag not found');
  return id;
}

async function getHashtagMedia(
  hashtagId: string,
  type: 'top_media' | 'recent_media',
): Promise<
  {
    id: string;
    media_type?: string;
    permalink?: string;
    timestamp?: string;
    thumbnail_url?: string;
  }[]
> {
  if (!IG_USER_ID || !ACCESS_TOKEN) {
    throw new Error('Missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN');
  }
  const fields = 'id,media_type,permalink,timestamp,thumbnail_url';
  const limit = 30;
  const u = `https://graph.facebook.com/${GRAPH_VERSION}/${hashtagId}/${type}?user_id=${IG_USER_ID}&fields=${encodeURIComponent(fields)}&limit=${limit}&access_token=${ACCESS_TOKEN}`;
  const res = await fetch(u);
  const data = (await res.json()) as {
    data?: { id: string; media_type?: string; permalink?: string; timestamp?: string; thumbnail_url?: string }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(data.error?.message ?? `Media fetch failed: ${res.status}`);
  }
  return data.data ?? [];
}

export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get('tag');
  const typeParam = req.nextUrl.searchParams.get('type');
  const type: 'top_media' | 'recent_media' =
    typeParam === 'top_media' ? 'top_media' : 'recent_media';

  if (!tag) {
    return NextResponse.json({ error: 'Missing tag' }, { status: 400, headers: REELS_CORS_HEADERS });
  }

  const clean = tag.replace(/^#/, '').trim();
  if (!clean) {
    return NextResponse.json({ error: 'Empty tag' }, { status: 400, headers: REELS_CORS_HEADERS });
  }

  try {
    const hashtagId = await getHashtagId(clean);
    const media = await getHashtagMedia(hashtagId, type);
    const reels = media.filter((m) => isShortFormVideo(m.media_type) && m.permalink);
    return NextResponse.json({ reels }, { headers: REELS_CORS_HEADERS });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Hashtag error';
    return NextResponse.json({ error: message }, { status: 500, headers: REELS_CORS_HEADERS });
  }
}
