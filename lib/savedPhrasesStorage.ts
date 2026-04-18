import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedPhrase, WordState } from '@/types/savedPhrase';

const KEY = 'lingua_saved_phrases_v1';

async function readAll(): Promise<SavedPhrase[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is SavedPhrase => x != null && typeof x === 'object');
  } catch {
    return [];
  }
}

async function writeAll(items: SavedPhrase[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function loadSavedPhrases(): Promise<SavedPhrase[]> {
  return readAll();
}

export async function savePhrase(
  entry: Omit<SavedPhrase, 'id' | 'createdAt'> & { id?: string },
): Promise<SavedPhrase> {
  const all = await readAll();
  const id = entry.id ?? `sp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row: SavedPhrase = {
    ...entry,
    id,
    createdAt: Date.now(),
  };
  const next = [row, ...all.filter((p) => !(p.text === row.text && p.reelId === row.reelId))];
  await writeAll(next);
  return row;
}

export async function updatePhraseState(id: string, wordState: WordState): Promise<void> {
  const all = await readAll();
  const next = all.map((p) => (p.id === id ? { ...p, wordState } : p));
  await writeAll(next);
}

export async function countSavedPhrases(): Promise<number> {
  const all = await readAll();
  return all.length;
}
