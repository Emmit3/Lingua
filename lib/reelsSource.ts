/**
 * Loads reel catalog:
 * 1) YouTube Shorts via proxy when `EXPO_PUBLIC_YOUTUBE_PROXY_URL` or `EXPO_PUBLIC_BACKEND_URL` is set
 * 2) Else optional remote JSON (`EXPO_PUBLIC_REELS_URL`)
 * 3) Else AsyncStorage cache, else bundled mock
 *
 * YouTube: set server env `YOUTUBE_API_KEY` (never in the client). See `reference-nextjs-api/`.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOCK_REELS } from '@/constants/mockReels';
import { filterReelsByPreferredTags } from '@/lib/filterReelsByPreferredTags';
import { fetchYoutubeShorts } from '@/lib/youtubeClient';
import { reelsFromYoutubeShorts } from '@/lib/youtubeShortsTransform';
import { loadLearningLanguage } from '@/lib/learningLanguageStorage';
import { loadUserYoutubePreferredTags } from '@/lib/youtubePreferencesStorage';
import type { ReelItemData } from '@/types/reel';

const CACHE_KEY = 'lingua_reels_catalog_v1';

function isLevel(x: unknown): x is 1 | 2 | 3 {
  return x === 1 || x === 2 || x === 3;
}

function normalizeReel(raw: unknown): ReelItemData | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const yt =
    typeof o.youtubeVideoId === 'string' && o.youtubeVideoId.length > 0
      ? o.youtubeVideoId
      : undefined;
  const ytEmbed =
    typeof o.youtubeEmbedUrl === 'string' && o.youtubeEmbedUrl.length > 0
      ? o.youtubeEmbedUrl
      : undefined;
  const fallbackUri = MOCK_REELS[0]?.videoUri ?? '';
  const videoUri =
    typeof o.videoUri === 'string' && o.videoUri.length > 0 ? o.videoUri : yt ? fallbackUri : '';
  if (typeof o.id !== 'string' || !videoUri) return null;
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
    videoUri,
    youtubeVideoId: yt,
    youtubeEmbedUrl: ytEmbed,
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

export type ReelsLoadSource = 'youtube' | 'remote' | 'cache' | 'fallback';

function youtubeProxyBase(): string | null {
  const b = (process.env.EXPO_PUBLIC_YOUTUBE_PROXY_URL ?? process.env.EXPO_PUBLIC_BACKEND_URL ?? '')
    .trim()
    .replace(/\/$/, '');
  return b || null;
}

export async function loadReels(): Promise<{
  reels: ReelItemData[];
  source: ReelsLoadSource;
}> {
  const proxy = youtubeProxyBase();
  if (proxy) {
    try {
      const learning = await loadLearningLanguage();
      const q =
        process.env.EXPO_PUBLIC_YOUTUBE_SEARCH_Q?.trim() ||
        [learning.youtubeQuery, learning.youtubeShortHashtags].filter(Boolean).join(' ');
      const language =
        process.env.EXPO_PUBLIC_REEL_LANGUAGE?.trim() || learning.code;
      const languageLabel =
        process.env.EXPO_PUBLIC_REEL_LANGUAGE_LABEL?.trim() || learning.label;
      const maxResults = Math.min(
        25,
        Math.max(4, Number(process.env.EXPO_PUBLIC_YOUTUBE_MAX_RESULTS ?? 12) || 12),
      );

      const { items } = await fetchYoutubeShorts({
        q,
        maxResults,
        language,
        languageLabel,
      });
      let reels = reelsFromYoutubeShorts(items, { language, languageLabel });

      const userTags = await loadUserYoutubePreferredTags();
      const envTags = (process.env.EXPO_PUBLIC_YOUTUBE_FILTER_TAGS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const merged = [...new Set([...userTags, ...envTags])];
      if (merged.length) {
        const filtered = filterReelsByPreferredTags(reels, merged, { mode: 'any' });
        if (filtered.length) {
          reels = filtered;
        }
      }

      if (reels.length) {
        await writeCache(reels);
        return { reels, source: 'youtube' };
      }
    } catch {
      /* fall through */
    }
    const cached = await readCache();
    if (cached?.length) {
      return { reels: cached, source: 'cache' };
    }
  }

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
