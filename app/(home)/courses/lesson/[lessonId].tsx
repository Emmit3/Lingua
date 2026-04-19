import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PracticeQuiz } from '@/components/courses/PracticeQuiz';
import {
  flattenLessons,
  questionsForLesson,
} from '@/constants/coursePathway';
import { markLessonComplete } from '@/lib/courseProgressStorage';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lesson = useMemo(
    () => flattenLessons().find((l) => l.id === lessonId),
    [lessonId],
  );

  const onComplete = async (_pct: number) => {
    if (lesson) await markLessonComplete(lesson.id);
    router.back();
  };

  if (!lesson) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white px-6"
        style={{ paddingBottom: insets.bottom }}>
        <Text className="text-center text-[#6B7280]">This lesson could not be found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: lesson.title }} />
      <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom + 8 }}>
        <PracticeQuiz
          title={lesson.kind === 'checkpoint' ? 'Checkpoint' : 'Practice'}
          questions={questionsForLesson(lesson)}
          onComplete={(pct) => void onComplete(pct)}
        />
      </View>
    </>
  );
}
