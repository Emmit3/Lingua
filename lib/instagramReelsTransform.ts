import { MOCK_REELS } from '@/constants/mockReels';
import { normalizeInstagramReelUrl, type HashtagReel, type OEmbedData } from '@/lib/instagram';
import type { ReelItemData } from '@/types/reel';

/** Dummy MP4 so `ReelItemData.videoUri` stays valid for JSON / tooling; native player is not used for IG rows. */
const DUMMY_VIDEO_URI =
  MOCK_REELS[0]?.videoUri ??
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

function idFromUrl(url: string): string {
  const compact = url.replace(/\W/g, '');
  return `ig_${compact.slice(-24)}`;
}

export function reelItemFromHashtagEntry(
  reel: HashtagReel,
  opts: {
    language: string;
    languageLabel: string;
    sourceTag?: string;
  },
): ReelItemData {
  const tag = opts.sourceTag;
  return {
    id: `ig_${reel.id}`,
    language: opts.language,
    languageLabel: opts.languageLabel,
    title: 'Instagram Reel',
    topic: 'Social',
    topicLocal: 'Instagram',
    transcript: 'Tap a word below to open the tutor. Use play inside the Instagram frame.',
    translation: 'Embedded reel — audio plays inside the Instagram player.',
    level: 2,
    videoUri: DUMMY_VIDEO_URI,
    instagramPermalink: reel.permalink,
    likeCount: 0,
    authorHandle: 'instagram',
    hashtags: tag ? [`#${tag.replace(/^#/, '')}`] : ['#reels'],
    commentCount: 0,
  };
}

function isShortFormVideo(mediaType: string | undefined): boolean {
  return mediaType === 'VIDEO' || mediaType === 'REELS';
}

export function reelsFromHashtagResults(
  reels: HashtagReel[],
  opts: { language: string; languageLabel: string; sourceTag?: string },
): ReelItemData[] {
  return reels
    .filter((r) => isShortFormVideo(r.media_type) && r.permalink)
    .map((r) => reelItemFromHashtagEntry(r, opts));
}

export async function reelItemFromOEmbedUrl(
  reelUrl: string,
  data: OEmbedData,
  opts: { language: string; languageLabel: string },
): Promise<ReelItemData> {
  const canonical = normalizeInstagramReelUrl(reelUrl);
  const title = data.title ?? data.author_name ?? 'Instagram';
  return {
    id: idFromUrl(canonical),
    language: opts.language,
    languageLabel: opts.languageLabel,
    title,
    topic: 'Social',
    topicLocal: 'Instagram',
    transcript:
      'Tap a word to practice. If the embed does not appear, open the reel on Instagram.',
    translation: data.author_name
      ? `From @${data.author_name.replace(/^@/, '')}`
      : 'Instagram embed',
    level: 2,
    videoUri: DUMMY_VIDEO_URI,
    instagramPermalink: canonical,
    likeCount: 0,
    authorHandle: data.author_name?.replace(/\s/g, '_').toLowerCase() ?? 'instagram',
    hashtags: ['#reels'],
    commentCount: 0,
  };
}
