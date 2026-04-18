#!/usr/bin/env node
/**
 * Optional offline helper: fetch stock video URLs from Pexels, then hand-edit
 * transcript/translation in the output JSON for language-learning reels.
 *
 * Usage:
 *   set PEXELS_API_KEY in env (https://www.pexels.com/api/)
 *   node scripts/pexels-draft.mjs
 *
 * This does NOT run in the Expo app — keep keys out of client bundles.
 */

const key = process.env.PEXELS_API_KEY;
if (!key) {
  console.error('Set PEXELS_API_KEY');
  process.exit(1);
}

const q = process.env.PEXELS_QUERY ?? 'people talking';
const res = await fetch(
  `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=5`,
  { headers: { Authorization: key } },
);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
const data = await res.json();
const reels = (data.videos ?? []).map((v, i) => ({
  id: `pexels-${v.id}`,
  language: 'es',
  languageLabel: 'Spanish',
  title: `Draft ${i + 1}`,
  topic: 'Replace me',
  transcript: 'Escribe aquí la frase objetivo.',
  translation: 'Write the English gloss here.',
  level: 1,
  videoUri: v.video_files?.find((f) => f.quality === 'hd')?.link ?? v.video_files?.[0]?.link,
  likeCount: 0,
  accentColor: '#f472b6',
}));

console.log(JSON.stringify({ reels }, null, 2));
