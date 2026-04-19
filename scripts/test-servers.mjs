/**
 * Smoke-test the Lingua backend proxy (YouTube Shorts API).
 *
 * Usage:
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

async function main() {
  console.log('Lingua server smoke tests\n');
  let failed = false;

  const healthUrl = `${proxyBase}/api/health`;
  process.stdout.write(`GET ${healthUrl} … `);
  try {
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(8000) });
    const text = await res.text();
    const json = JSON.parse(text);
    if (res.ok && json?.ok === true) {
      console.log('OK', `(youtubeApiKey: ${json?.configured?.youtubeApiKey})`);
    } else {
      console.log('FAIL', res.status, text.slice(0, 200));
      failed = true;
    }
  } catch (e) {
    console.log('FAIL', e instanceof Error ? e.message : e);
    console.log(
      '\nTip: start the proxy from Lingua/reference-nextjs-api (`npm run dev`) or pass a URL:\n  node scripts/test-servers.mjs https://your-host',
    );
    failed = true;
  }

  process.exit(failed ? 1 : 0);
}

main();
