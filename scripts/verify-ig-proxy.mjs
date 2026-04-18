/**
 * Verify the Instagram proxy is reachable and (optionally) returns oEmbed / hashtag data.
 *
 * Usage:
 *   node scripts/verify-ig-proxy.mjs http://127.0.0.1:3040
 *   EXPO_PUBLIC_IG_PROXY_URL=http://10.0.2.2:3040 node scripts/verify-ig-proxy.mjs
 *
 * Optional env:
 *   IG_TEST_REEL_URL=https://www.instagram.com/reel/XXXX/  — exercises oEmbed (needs valid server token)
 *   IG_TEST_HASHTAG=learnspanish — exercises hashtag route (needs token + INSTAGRAM_USER_ID on server)
 */

const baseArg = process.argv[2]?.replace(/\/$/, '');
const base = baseArg || process.env.EXPO_PUBLIC_IG_PROXY_URL?.replace(/\/$/, '');

if (!base) {
  console.error(
    'Missing proxy base URL.\nExample: node scripts/verify-ig-proxy.mjs http://127.0.0.1:3040',
  );
  process.exit(1);
}

async function main() {
  console.log('Proxy base:', base);

  const healthUrl = `${base}/api/reels/health`;
  const h = await fetch(healthUrl);
  const healthText = await h.text();
  console.log('\nGET', healthUrl);
  console.log('Status:', h.status);
  let healthJson;
  try {
    healthJson = JSON.parse(healthText);
  } catch {
    console.log('Body (raw):', healthText.slice(0, 500));
    process.exit(h.ok ? 0 : 1);
  }
  console.log('Body:', JSON.stringify(healthJson, null, 2));

  if (!h.ok) process.exit(1);

  const reelUrl = process.env.IG_TEST_REEL_URL?.trim();
  if (reelUrl) {
    const oembedUrl = `${base}/api/reels/oembed?url=${encodeURIComponent(reelUrl)}`;
    const r = await fetch(oembedUrl);
    const t = await r.text();
    console.log('\nGET', oembedUrl.split('?')[0] + '?url=…');
    console.log('Status:', r.status);
    try {
      console.log('Body:', JSON.stringify(JSON.parse(t), null, 2).slice(0, 2000));
    } catch {
      console.log('Body (raw):', t.slice(0, 800));
    }
  }

  const tag = process.env.IG_TEST_HASHTAG?.trim();
  if (tag) {
    const tagUrl = `${base}/api/reels/hashtag?tag=${encodeURIComponent(tag)}&type=recent_media`;
    const r = await fetch(tagUrl);
    const t = await r.text();
    console.log('\nGET', tagUrl.split('?')[0] + '?tag=…');
    console.log('Status:', r.status);
    try {
      const j = JSON.parse(t);
      const reels = j.reels;
      if (Array.isArray(reels)) {
        console.log('Reels count:', reels.length);
        console.log(
          'Sample permalinks:',
          reels.slice(0, 3).map((x) => x.permalink || x.id),
        );
      }
      console.log('Body (truncated):', JSON.stringify(j, null, 2).slice(0, 2500));
    } catch {
      console.log('Body (raw):', t.slice(0, 800));
    }
  }

  if (!reelUrl && !tag) {
    console.log('\n(No IG_TEST_REEL_URL / IG_TEST_HASHTAG — health check only.)');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
