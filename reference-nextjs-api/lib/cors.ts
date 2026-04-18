import { NextResponse } from 'next/server';

/** Dev-friendly CORS so Expo Web can call the proxy from another origin. */
export const REELS_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function corsOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: REELS_CORS_HEADERS });
}
