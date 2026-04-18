/**
 * Loads reel catalog: optional remote JSON (EXPO_PUBLIC_REELS_URL), then AsyncStorage cache, else bundled mock.
 *
 * Expected JSON: either `ReelItemData[]` or `{ "reels": ReelItemData[] }`
 * Required fields per item: id, language, languageLabel, title, topic, transcript, translation, level, videoUri
 * Optional: likeCount, accentColor, topicColor, hashtags, shareMessage, authorHandle, commentCount, topicLocal
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOCK_REELS } from '@/constants/mockReels';
import type { ReelItemData } from '@/types/reel';

const CACHE_KEY = 'lingua_reels_catalog_v1';

function isLevel(x: unknown): x is 1 | 2 | 3 {
  return x === 1 || x === 2 || x === 3;
}

function normalizeReel(raw: unknown): ReelItemData | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.videoUri !== 'string') return null;
  if (typeof o.language !== 'string' || typeof o.languageLabel !== 'string') return null;
  if (typeof o.title !== 'string' || typeof o.topic !== 'string') return null;
  if (typeof o.transcript !== 'string' || typeof o.translation !== 'string') return null;
  if (!isLevel(o.level)) return null;

  const likeCount = typeof o.likeCount === 'number' && o.likeCount >= 0 ? o.likeCount : 0;

  return {
    id: o.id,
    language: o.language,
    languageLabel: o.languageLabel,
    title: o.title,
    topic: o.topic,
    transcript: o.transcript,
    translation: o.translation,
    level: o.level,
    videoUri: o.videoUri,
    likeCount,
    accentColor: typeof o.accentColor === 'string' ? o.accentColor : undefined,
    topicColor: typeof o.topicColor === 'string' ? o.topicColor : undefined,
    hashtags: Array.isArray(o.hashtags) ? o.hashtags.filter((t): t is string => typeof t === 'string') : undefined,
    shareMessage: typeof o.shareMessage === 'string' ? o.shareMessage : undefined,
    authorHandle: typeof o.authorHandle === 'string' ? o.authorHandle : undefined,
    commentCount:
      typeof o.commentCount === 'number' && o.commentCount >= 0 ? o.commentCount : undefined,
    topicLocal: typeof o.topicLocal === 'string' ? o.topicLocal : undefined,
  };
}

function parsePayload(json: unknown): ReelItemData[] {
  if (Array.isArray(json)) {
    return json.map(normalizeReel).filter((x): x is ReelItemData => x != null);
  }
  if (json && typeof json === 'object' && 'reels' in json) {
    const reels = (json as { reels: unknown }).reels;
    if (Array.isArray(reels)) {
      return reels.map(normalizeReel).filter((x): x is ReelItemData => x != null);
    }
  }
  return [];
}

async function readCache(): Promise<ReelItemData[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const reels = parsePayload(parsed);
    return reels.length ? reels : null;
  } catch {
    return null;
  }
}

async function writeCache(reels: ReelItemData[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(reels));
  } catch {
    /* ignore */
  }
}

export type ReelsLoadSource = 'remote' | 'cache' | 'fallback';

export async function loadReels(): Promise<{
  reels: ReelItemData[];
  source: ReelsLoadSource;
}> {
  const url = process.env.EXPO_PUBLIC_REELS_URL;

  if (url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      const reels = parsePayload(json);
      if (reels.length) {
        await writeCache(reels);
        return { reels, source: 'remote' };
      }
    } catch {
      /* try cache */
    }
    const cached = await readCache();
    if (cached?.length) {
      return { reels: cached, source: 'cache' };
    }
  }

  return { reels: MOCK_REELS, source: 'fallback' };
}
