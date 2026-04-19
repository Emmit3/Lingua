import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lingua_youtube_preferred_tags_v1';

/** Comma or newline separated in storage → string array */
export async function loadUserYoutubePreferredTags(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function saveUserYoutubePreferredTags(tags: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, tags.join(','));
  } catch {
    /* ignore */
  }
}
