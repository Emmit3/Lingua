import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lingua_course_progress_v1';

export type CourseProgress = {
  completedLessonIds: string[];
  /** Last placement score 0–100 (percentage). */
  lastPlacementPercent?: number;
};

const empty: CourseProgress = { completedLessonIds: [] };

export async function loadCourseProgress(): Promise<CourseProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
      lastPlacementPercent:
        typeof parsed.lastPlacementPercent === 'number'
          ? parsed.lastPlacementPercent
          : undefined,
    };
  } catch {
    return { ...empty };
  }
}

export async function saveCourseProgress(next: CourseProgress): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function markLessonComplete(lessonId: string): Promise<CourseProgress> {
  const cur = await loadCourseProgress();
  if (cur.completedLessonIds.includes(lessonId)) return cur;
  const next: CourseProgress = {
    ...cur,
    completedLessonIds: [...cur.completedLessonIds, lessonId],
  };
  await saveCourseProgress(next);
  return next;
}

export async function setPlacementScore(percent: number): Promise<CourseProgress> {
  const cur = await loadCourseProgress();
  const next: CourseProgress = { ...cur, lastPlacementPercent: percent };
  await saveCourseProgress(next);
  return next;
}
