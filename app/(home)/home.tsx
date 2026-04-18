import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { addDays, isBefore, startOfDay, startOfWeek } from 'date-fns';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/home/CourseCard';
import { StatRing } from '@/components/home/StatRing';
import { WeekStrip } from '@/components/home/WeekStrip';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const TAB_BAR_SPACE = 88;

export default function HomeDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const studyMinutes = useOnboardingStore((s) => s.studyMinutes);

  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const completedDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i)).filter((d) =>
    isBefore(startOfDay(d), startOfDay(today)),
  );

  const listeningSeconds = 0;
  const dailyGoalSeconds = Math.max(60, studyMinutes * 60);

  return (
    <LinearGradient
      colors={['#2196F3', '#1565C0', '#0D3B8C']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View
        className="mx-auto w-full max-w-[390px] flex-1"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center rounded-full bg-white/20 px-3 py-2">
            <Text className="text-base">🔥</Text>
            <Text className="ml-1 text-sm font-bold text-white">1</Text>
          </View>
          <Text className="text-xl font-semibold lowercase tracking-tight text-white">lingua</Text>
          <View className="flex-row items-center rounded-full bg-white/20 px-3 py-2">
            <Text className="text-base">📖</Text>
            <Text className="ml-1 text-sm font-bold text-white">4 words</Text>
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
            <Text className="text-lg font-bold text-brand-blue">▶ Continue</Text>
          </Pressable>
        </View>

        <View className="mt-auto rounded-t-3xl bg-white px-5 pb-6 pt-5">
          <CourseCard title="Parrot Flight School" />
        </View>
      </View>
    </LinearGradient>
  );
}
