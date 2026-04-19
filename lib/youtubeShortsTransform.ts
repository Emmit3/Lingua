import { MOCK_REELS } from '@/constants/mockReels';
import type { YoutubeShortsApiItem } from '@/lib/youtubeClient';
import type { ReelItemData } from '@/types/reel';

const PLACEHOLDER_VIDEO_URI =
  MOCK_REELS[0]?.videoUri ??
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

function extractHashtags(text: string): string[] {
  const found = text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  return [...new Set(found)].slice(0, 12);
}

function slugChannel(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_.]/g, '')
    .slice(0, 28) || 'youtube';
}

export function reelItemFromYoutubeShort(
  row: YoutubeShortsApiItem,
  opts: { language: string; languageLabel: string },
): ReelItemData {
  const desc = row.description?.trim() ?? '';
  const fromApiTags = row.tags?.length ? row.tags.map((t) => (t.startsWith('#') ? t : `#${t}`)) : [];
  const fromDesc = extractHashtags(desc);
  const hashtags = [...new Set([...fromApiTags, ...fromDesc])].slice(0, 14);

  const transcript = desc.slice(0, 420) || row.title;
  return {
    id: `yt_${row.videoId}`,
    language: opts.language,
    languageLabel: opts.languageLabel,
    title: row.title,
    topic: 'YouTube',
    topicLocal: 'Shorts',
    transcript,
    translation: `Short from @${slugChannel(row.channelTitle)} — tap words below to practice.`,
    level: 2,
    videoUri: PLACEHOLDER_VIDEO_URI,
    youtubeVideoId: row.videoId,
    youtubeEmbedUrl: row.embedUrl,
    likeCount: 0,
    authorHandle: slugChannel(row.channelTitle),
    hashtags: hashtags.length ? hashtags : ['#shorts'],
    commentCount: 0,
  };
}

export function reelsFromYoutubeShorts(
  items: YoutubeShortsApiItem[],
  opts: { language: string; languageLabel: string },
): ReelItemData[] {
  return items.map((row) => reelItemFromYoutubeShort(row, opts));
}
