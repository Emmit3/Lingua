import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
import { AppFont } from '@/constants/appFonts';
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
      colors={['#050505', '#0c0c0c', '#141414']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}>
      <StatusBar style="light" />
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
            <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Learning path
            </Text>
            <View className="mt-1 flex-row items-center gap-2">
              <Text
                className="text-3xl font-extrabold text-white"
                style={{ fontFamily: AppFont.serif }}>
                {learning?.label ?? 'Your course'}
              </Text>
              <Text className="text-2xl">{languageFlagEmoji(learning?.code ?? 'es')}</Text>
            </View>
            <Text className="mt-2 text-base text-neutral-400">
              {doneCount} / {totalLessons} steps completed
            </Text>
          </View>
          <View className="items-end">
            <View className="rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-2">
              <Text className="text-xs font-semibold text-amber-100/95">
                🔥 Keep the streak on the Home tab
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(home)/courses/placement' as Href)}
          className="mt-6 flex-row items-center justify-between rounded-2xl border border-cyan-500/45 bg-neutral-900/90 px-4 py-4 active:opacity-90">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15">
              <FontAwesome name="graduation-cap" size={22} color="#22d3ee" />
            </View>
            <View>
              <Text className="text-base font-bold text-white">Placement test</Text>
              <Text className="mt-0.5 text-sm text-neutral-400">
                {placementPct != null
                  ? `Last score: ${placementPct}% · Tap to retake`
                  : '5 questions · find your level'}
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#737373" />
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
                          <View className="h-5 w-1 rounded-full bg-neutral-700" />
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

        <Text className="mt-10 text-center text-xs text-neutral-600">
          Demo pathway · progress is saved on this device
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
