import type { ReelItemData } from '@/types/reel';

/**
 * Client-only feed bias: deprioritize reels marked show_less; prefer level match.
 */
export function rankReelsForFeed(
  reels: ReelItemData[],
  opts: { showLessIds: Set<string>; userLevel: 1 | 2 | 3 },
): ReelItemData[] {
  return [...reels].sort((a, b) => {
    const sa = opts.showLessIds.has(a.id) ? 1 : 0;
    const sb = opts.showLessIds.has(b.id) ? 1 : 0;
    if (sa !== sb) return sa - sb;
    const da = Math.abs(a.level - opts.userLevel);
    const db = Math.abs(b.level - opts.userLevel);
    if (da !== db) return da - db;
    return 0;
  });
}
