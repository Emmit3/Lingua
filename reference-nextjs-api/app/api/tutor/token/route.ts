import { NextResponse } from 'next/server';

import { API_CORS_HEADERS, corsOptions } from '@/lib/cors';

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: API_CORS_HEADERS });
}

export function OPTIONS() {
  return corsOptions();
}

/**
 * One-time HeyGen streaming token — never send HEYGEN_API_KEY to the browser.
 * Legacy endpoint supported through Oct 2026 per HeyGen; v3 migration uses create-session-token.
 */
export async function POST() {
  const key = process.env.HEYGEN_API_KEY?.trim();
  if (!key) {
    return json({ error: 'Server misconfigured: HEYGEN_API_KEY' }, 500);
  }

  const res = await fetch('https://api.heygen.com/v1/streaming.create_token', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return json({ error: 'HeyGen returned non-JSON' }, 502);
  }

  const o = data as {
    data?: { token?: string };
    token?: string;
    message?: string;
    error?: { message?: string } | string;
  };

  if (!res.ok) {
    const msg =
      typeof o.error === 'string'
        ? o.error
        : o.error?.message ?? o.message ?? `HeyGen token failed (${res.status})`;
    return json({ error: msg, details: data }, res.status >= 400 ? res.status : 502);
  }

  const token = o.data?.token ?? o.token;
  if (!token) {
    return json({ error: 'No token in HeyGen response', details: data }, 502);
  }

  return json({ token }, 200);
}
