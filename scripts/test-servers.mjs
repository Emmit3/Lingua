/**
 * Smoke-test the Lingua backend proxy (YouTube: health, verify, Shorts).
 *
 * Usage:
 *   npm run test:servers
 *   node scripts/test-servers.mjs
 *   node scripts/test-servers.mjs http://127.0.0.1:3040
 *
 * Env (optional):
 *   EXPO_PUBLIC_YOUTUBE_PROXY_URL or EXPO_PUBLIC_BACKEND_URL
 */

const proxyBase =
  process.argv[2]?.replace(/\/$/, '') ||
  process.env.EXPO_PUBLIC_YOUTUBE_PROXY_URL?.replace(/\/$/, '') ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:3040';

const timeout = 25_000;

async function getJson(path) {
  const url = `${proxyBase}${path}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _raw: text.slice(0, 400) };
  }
  return { url, res, json, text };
}

async function main() {
  console.log('Lingua server smoke tests\n');
  console.log('Proxy base:', proxyBase, '\n');
  let failed = false;

  process.stdout.write(`GET /api/health … `);
  try {
    const { res, json } = await getJson('/api/health');
    if (res.ok && json?.ok === true) {
      console.log('OK', `(youtubeApiKey configured: ${json?.configured?.youtubeApiKey})`);
    } else {
      console.log('FAIL', res.status, JSON.stringify(json).slice(0, 200));
      failed = true;
    }
  } catch (e) {
    console.log('FAIL', e instanceof Error ? e.message : e);
    failed = true;
  }

  process.stdout.write(`GET /api/youtube/verify … `);
  try {
    const { res, json } = await getJson('/api/youtube/verify');
    const probe = json?.probe;
    if (res.ok && json?.ok === true && probe?.ok === true) {
      console.log(
        'OK',
        `(search items: ${probe.searchItemCount}, videos: ${probe.videosItemCount}` +
          (probe.sample ? `, sample: ${probe.sample.videoId}` : '') +
          ')',
      );
    } else {
      console.log(
        'FAIL',
        res.status,
        probe?.youtubeErrorMessage || json?.error || JSON.stringify(json).slice(0, 200),
      );
      failed = true;
    }
  } catch (e) {
    console.log('FAIL', e instanceof Error ? e.message : e);
    failed = true;
  }

  const shortsPath =
    '/api/youtube/shorts?' +
    new URLSearchParams({ q: 'learn spanish #learnspanish', maxResults: '4' }).toString();
  process.stdout.write(`GET /api/youtube/shorts … `);
  try {
    const { res, json } = await getJson(shortsPath);
    const n = Array.isArray(json?.items) ? json.items.length : 0;
    if (res.ok && n > 0) {
      const first = json.items[0];
      console.log('OK', `(${n} items, first: ${first?.videoId})`);
    } else {
      console.log('FAIL', res.status, json?.error || `items: ${n}`, JSON.stringify(json).slice(0, 160));
      failed = true;
    }
  } catch (e) {
    console.log('FAIL', e instanceof Error ? e.message : e);
    failed = true;
  }

  if (failed) {
    console.log(
      '\nTip: start the proxy (`cd reference-nextjs-api && npm run dev`) or run `npm run verify:youtube` there.',
    );
  }

  process.exit(failed ? 1 : 0);
}

main();
