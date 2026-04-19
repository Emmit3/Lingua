import type { ReelItemData } from '@/types/reel';

export type TagFilterMode = 'any' | 'all';

/**
 * Personalize the Shorts feed: keep items that match user / product tag preferences.
 * Matches against `hashtags`, `title`, and `transcript` (YouTube API rarely returns uploader tags for third-party videos).
 */
export function filterReelsByPreferredTags(
  reels: ReelItemData[],
  preferredTags: string[],
  options?: { mode?: TagFilterMode },
): ReelItemData[] {
  const raw = preferredTags.map((t) => t.trim().replace(/^#/, '').toLowerCase()).filter(Boolean);
  if (!raw.length) return reels;

  const mode: TagFilterMode = options?.mode ?? 'any';

  const haystackFor = (item: ReelItemData): string => {
    const tagStr = (item.hashtags ?? []).join(' ');
    return `${item.title} ${item.transcript} ${tagStr}`.toLowerCase();
  };

  return reels.filter((item) => {
    const hay = haystackFor(item);
    if (mode === 'all') {
      return raw.every((tag) => hay.includes(tag));
    }
    return raw.some((tag) => hay.includes(tag));
  });
}
