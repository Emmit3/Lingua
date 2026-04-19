import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { PathLessonBubble } from '@/components/courses/PathLessonBubble';
import { COURSE_UNITS, flattenLessons, lessonUnlockState } from '@/constants/coursePathway';
import type { LearningLanguageOption } from '@/constants/learningLanguages';
import { loadCourseProgress } from '@/lib/courseProgressStorage';
import { languageFlagEmoji } from '@/lib/languageMeta';
import { loadLearningLanguage } from '@/lib/learningLanguageStorage';

const TAB_BAR_SPACE = 88;

export default function CoursesPathwayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [learning, setLearning] = useState<LearningLanguageOption | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [placementPct, setPlacementPct] = useState<number | undefined>();

  const refresh = useCallback(async () => {
    const [lang, progress] = await Promise.all([loadLearningLanguage(), loadCourseProgress()]);
    setLearning(lang);
    setCompletedIds(new Set(progress.completedLessonIds));
    setPlacementPct(progress.lastPlacementPercent);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const unlockMap = lessonUnlockState(completedIds);
  const totalLessons = flattenLessons().length;
  const doneCount = completedIds.size;

  return (
    <LinearGradient
      colors={['#E8F7EE', '#D4F1F4', '#E8EEF9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom + 24,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
              Learning path
            </Text>
            <View className="mt-1 flex-row items-center gap-2">
              <Text className="text-3xl font-extrabold text-[#121826]">
                {learning?.label ?? 'Your course'}
              </Text>
              <Text className="text-2xl">{languageFlagEmoji(learning?.code ?? 'es')}</Text>
            </View>
            <Text className="mt-2 text-base text-[#6B7280]">
              {doneCount} / {totalLessons} steps completed
            </Text>
          </View>
          <View className="items-end">
            <View className="rounded-full bg-white/90 px-3 py-2 shadow-sm">
              <Text className="text-xs font-semibold text-[#374151]">
                🔥 Keep the streak on the Home tab
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(home)/courses/placement' as Href)}
          className="mt-6 flex-row items-center justify-between rounded-2xl border-2 border-[#1CB0F6] bg-white px-4 py-4 active:opacity-90">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-[#E3F4FF]">
              <FontAwesome name="graduation-cap" size={22} color="#1CB0F6" />
            </View>
            <View>
              <Text className="text-base font-bold text-[#121826]">Placement test</Text>
              <Text className="mt-0.5 text-sm text-[#6B7280]">
                {placementPct != null
                  ? `Last score: ${placementPct}% · Tap to retake`
                  : '5 questions · find your level'}
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
        </Pressable>

        <View className="mt-10">
          {COURSE_UNITS.map((unit, unitIndex) => (
            <View key={unit.id} className={unitIndex > 0 ? 'mt-12' : ''}>
              <View
                className="self-start rounded-xl px-4 py-2"
                style={{ backgroundColor: unit.accent }}>
                <Text className="text-sm font-extrabold uppercase tracking-wide text-white">
                  {unit.title}
                </Text>
                <Text className="text-xs font-semibold text-white/90">{unit.subtitle}</Text>
              </View>

              <View className="mt-4">
                {unit.lessons.map((lesson, li) => {
                  const status = unlockMap.get(lesson.id) ?? 'locked';
                  const zig = li % 2 === 0;
                  return (
                    <View key={lesson.id}>
                      {li > 0 ? (
                        <View className="mb-2 items-center">
                          <View className="h-5 w-1 rounded-full bg-[#C8E6C9]" />
                        </View>
                      ) : null}
                      <View
                        className="mb-2 flex-row"
                        style={{ justifyContent: zig ? 'flex-start' : 'flex-end' }}>
                        <View style={{ marginLeft: zig ? 8 : 0, marginRight: zig ? 0 : 8 }}>
                          <PathLessonBubble
                            lesson={lesson}
                            status={status}
                            accent={unit.accent}
                            onPress={() =>
                              router.push(
                                `/(home)/courses/lesson/${lesson.id}` as Href,
                              )
                            }
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <Text className="mt-10 text-center text-xs text-[#9CA3AF]">
          Demo pathway · progress is saved on this device
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
