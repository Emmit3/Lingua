import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addDays, isBefore, startOfDay, startOfWeek } from 'date-fns';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/home/CourseCard';
import { AppFont } from '@/constants/appFonts';
import { StatRing } from '@/components/home/StatRing';
import { WeekStrip } from '@/components/home/WeekStrip';
import { useLocale } from '@/contexts/LocaleContext';
import { loadLearningLanguage } from '@/lib/learningLanguageStorage';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const TAB_BAR_SPACE = 88;

export default function HomeDashboardScreen() {
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const studyMinutes = useOnboardingStore((s) => s.studyMinutes);
  const [pathTitle, setPathTitle] = useState('Learning path');

  useFocusEffect(
    useCallback(() => {
      void loadLearningLanguage().then((lang) => {
        setPathTitle(lang ? `${lang.label} · pathway` : 'Learning path');
      });
    }, []),
  );

  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const completedDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i)).filter((d) =>
    isBefore(startOfDay(d), startOfDay(today)),
  );

  const listeningSeconds = 0;
  const dailyGoalSeconds = Math.max(60, studyMinutes * 60);

  return (
    <LinearGradient
      colors={['#0a0a0a', '#111111', '#171717']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View
        className="w-full flex-1"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <View className="relative min-h-[44px] justify-center px-5">
          <View
            className="flex-row items-center justify-between"
            style={{ zIndex: 2 }}
            pointerEvents="box-none">
            <View className="flex-row items-center rounded-full border border-white/15 bg-white/5 px-3 py-2">
              <FontAwesome name="fire" size={14} color="#d4d4d4" />
              <Text className="ml-1.5 text-sm font-semibold text-neutral-100">1</Text>
            </View>
            <View className="flex-row items-center rounded-full border border-white/15 bg-white/5 px-3 py-2">
              <FontAwesome name="book" size={14} color="#d4d4d4" />
              <Text className="ml-1.5 text-sm font-semibold text-neutral-100">4 words</Text>
            </View>
          </View>
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, { zIndex: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <Text
              className="text-xl lowercase tracking-tight text-white"
              style={{ fontFamily: AppFont.serif }}>
              lingua
            </Text>
          </View>
        </View>

        <View className="mt-4 px-4">
          <WeekStrip startOfWeek={monday} completedDays={completedDays} today={today} />
        </View>

        <View className="mt-6 flex-1 items-center">
          <StatRing
            seconds={listeningSeconds}
            maxSeconds={dailyGoalSeconds}
            size={180}
          />
          <Pressable
            accessibilityRole="button"
            className="mt-8 flex-row items-center rounded-full bg-white px-10 py-4 active:opacity-90"
            onPress={() => router.push('/(home)/feed')}>
            <Text className="text-lg font-semibold text-neutral-950">Continue</Text>
          </Pressable>
        </View>

        <View className="mt-auto border-t border-white/10 bg-neutral-950 px-5 pb-6 pt-5">
          <View className="mb-3 flex-row justify-end">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('tab.profile')}
              accessibilityHint="Opens your profile and settings"
              onPress={() => router.push('/(home)/profile')}
              className="h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 active:opacity-80">
              <FontAwesome name="user" size={18} color="#e5e5e5" />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Opens the courses tab with your learning path"
            onPress={() => router.push('/(home)/courses')}>
            <CourseCard title={pathTitle} />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
