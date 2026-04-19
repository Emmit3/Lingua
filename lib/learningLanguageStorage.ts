import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_LEARNING_LANGUAGE,
  type LearningLanguageOption,
  learningOptionByCode,
} from '@/constants/learningLanguages';

const KEY = 'lingua_learning_language_v1';

export async function loadLearningLanguage(): Promise<LearningLanguageOption> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_LEARNING_LANGUAGE;
    const parsed = JSON.parse(raw) as { code?: string };
    if (typeof parsed.code !== 'string') return DEFAULT_LEARNING_LANGUAGE;
    return learningOptionByCode(parsed.code) ?? DEFAULT_LEARNING_LANGUAGE;
  } catch {
    return DEFAULT_LEARNING_LANGUAGE;
  }
}

export async function saveLearningLanguage(option: LearningLanguageOption): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify({ code: option.code }));
  } catch {
    /* ignore */
  }
}
