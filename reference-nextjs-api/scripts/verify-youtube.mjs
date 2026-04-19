/**
 * End-to-end check: local proxy + YouTube Data API.
 *
 * Usage:
 *   npm run verify:youtube
 *   node scripts/verify-youtube.mjs http://127.0.0.1:3040
 *
 * Requires: `npm run dev` (or server on that port) and valid YOUTUBE_API_KEY in .env.local
 */

const base = (process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '');
/** Per-request limit so you see a failure instead of hanging forever. */
const REQUEST_MS = 15_000;

function logStep(n, total, label) {
  console.log(`\n[${n}/${total}] ${label}`);
}

async function get(path) {
  const url = `${base}${path}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { _raw: text.slice(0, 500) };
    }
    return { url, res, json };
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  console.log('Lingua YouTube proxy verification');
  console.log('Base URL:', base);
  console.log(
    '\nIf nothing prints after a step for ~15s, the proxy is not responding.',
  );
  console.log(
    'PowerShell: if you see >> on the prompt, press Ctrl+C and run the command again.\n',
  );

  const total = 3;
  let health;
  let verify;
  let shorts;

  logStep(1, total, `GET /api/health (timeout ${REQUEST_MS / 1000}s) …`);
  try {
    health = await get('/api/health');
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const cause = err.cause instanceof Error ? ` (${err.cause.message})` : '';
    console.error('FAILED:', err.message + cause);
    console.error(
      '\nFix: cd reference-nextjs-api && npm run dev — then open http://127.0.0.1:3040/api/health in a browser.',
    );
    process.exit(1);
  }
  console.log('Status:', health.res.status, health.url);
  console.log(JSON.stringify(health.json, null, 2));

  logStep(2, total, `GET /api/youtube/verify (calls Google; timeout ${REQUEST_MS / 1000}s) …`);
  try {
    verify = await get('/api/youtube/verify');
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const cause = err.cause instanceof Error ? ` (${err.cause.message})` : '';
    console.error('FAILED:', err.message + cause);
    process.exit(1);
  }
  console.log('Status:', verify.res.status, verify.url);
  console.log(JSON.stringify(verify.json, null, 2));

  logStep(3, total, `GET /api/youtube/shorts …`);
  try {
    shorts = await get(
      '/api/youtube/shorts?' +
        new URLSearchParams({ q: 'learn spanish #learnspanish', maxResults: '3' }).toString(),
    );
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const cause = err.cause instanceof Error ? ` (${err.cause.message})` : '';
    console.error('FAILED:', err.message + cause);
    process.exit(1);
  }
  console.log('Status:', shorts.res.status, shorts.url);
  const items = shorts.json?.items;
  console.log(
    JSON.stringify(
      {
        error: shorts.json?.error,
        itemCount: Array.isArray(items) ? items.length : null,
        first:
          Array.isArray(items) && items[0]
            ? {
                videoId: items[0].videoId,
                title: items[0].title?.slice(0, 80),
                durationSeconds: items[0].durationSeconds,
              }
            : null,
      },
      null,
      2,
    ),
  );

  const failed =
    !health.res.ok ||
    !verify.res.ok ||
    !shorts.res.ok ||
    !Array.isArray(items) ||
    items.length === 0;

  if (failed) {
    console.log('\nSome checks failed — see HTTP status and errors above.');
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  console.error('\nTip: start the API with `npm run dev` in reference-nextjs-api/');
  process.exit(1);
});
