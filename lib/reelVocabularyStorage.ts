import AsyncStorage from '@react-native-async-storage/async-storage';

import { lemmasFromTranscript } from '@/lib/captionWords';
import type { ReelItemData } from '@/types/reel';
import type { ReelVocabularyEntry } from '@/types/reelVocabulary';

const KEY = 'lingua_reel_vocab_v1';

function storageKey(language: string, lemma: string): string {
  return `${language.toLowerCase().slice(0, 8)}:${lemma}`;
}

async function readAll(): Promise<Record<string, ReelVocabularyEntry>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, ReelVocabularyEntry>;
  } catch {
    return {};
  }
}

async function writeAll(rows: Record<string, ReelVocabularyEntry>): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(rows));
}

/** Merge lemmas from the transcript of a reel the user is viewing. */
export async function recordWordsSeenFromReel(reel: ReelItemData): Promise<void> {
  const transcript = reel.transcript?.trim();
  if (!transcript) return;

  const pairs = lemmasFromTranscript(transcript);
  if (pairs.size === 0) return;

  const lang = reel.language || 'und';
  const now = Date.now();
  const all = await readAll();

  for (const [lemma, surface] of pairs) {
    const k = storageKey(lang, lemma);
    const prev = all[k];
    const alreadyInThisReel = prev?.reelIds.includes(reel.id);

    if (!prev) {
      all[k] = {
        lemma,
        surface,
        language: lang,
        firstSeenAt: now,
        lastSeenAt: now,
        reelCount: 1,
        reelIds: [reel.id],
      };
    } else {
      const reelIds = alreadyInThisReel
        ? prev.reelIds
        : [...prev.reelIds, reel.id];
      const reelCount = alreadyInThisReel ? prev.reelCount : prev.reelCount + 1;
      all[k] = {
        ...prev,
        surface: prev.surface || surface,
        lastSeenAt: now,
        reelCount,
        reelIds,
      };
    }
  }

  await writeAll(all);
}

export async function loadReelVocabulary(): Promise<ReelVocabularyEntry[]> {
  const all = await readAll();
  return Object.values(all).sort((a, b) => b.lastSeenAt - a.lastSeenAt);
}
