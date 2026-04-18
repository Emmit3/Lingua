import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lingua_liked_reel_ids_v1';

export async function loadLikedIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

export async function saveLikedIds(ids: Set<string>): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify([...ids]));
}
