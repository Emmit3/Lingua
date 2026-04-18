import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOW_LESS = 'lingua_reel_show_less_v1';
const USER_LEVEL = 'lingua_user_level_pref_v1';

export async function loadShowLessReelIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(SHOW_LESS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

export async function addShowLessReelId(id: string): Promise<void> {
  const s = await loadShowLessReelIds();
  s.add(id);
  await AsyncStorage.setItem(SHOW_LESS, JSON.stringify([...s]));
}

export async function loadUserLevelPref(): Promise<1 | 2 | 3> {
  try {
    const raw = await AsyncStorage.getItem(USER_LEVEL);
    const n = raw ? Number(raw) : 2;
    if (n === 1 || n === 2 || n === 3) return n;
    return 2;
  } catch {
    return 2;
  }
}

export async function saveUserLevelPref(level: 1 | 2 | 3): Promise<void> {
  await AsyncStorage.setItem(USER_LEVEL, String(level));
}
