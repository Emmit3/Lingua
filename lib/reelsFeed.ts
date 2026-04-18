import type { ReelItemData } from '@/types/reel';

/** Fisher–Yates shuffle copy */
function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * New reel rows for infinite feed: same clips in a new order with unique ids
 * (likes stay per-row id; that’s acceptable for looped copies).
 */
export function cloneCatalogRound(
  catalog: ReelItemData[],
  round: number,
): ReelItemData[] {
  return shuffle(catalog).map((r, i) => ({
    ...r,
    id: `${r.id}__r${round}_${i}`,
  }));
}
