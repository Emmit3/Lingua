import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PracticeQuiz } from '@/components/courses/PracticeQuiz';
import { PLACEMENT_QUESTIONS } from '@/constants/coursePathway';
import { setPlacementScore } from '@/lib/courseProgressStorage';

export default function PlacementTestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');
  const [score, setScore] = useState(0);

  const onComplete = async (pct: number) => {
    await setPlacementScore(pct);
    setScore(pct);
    setPhase('result');
  };

  if (phase === 'result') {
    let message = 'Solid foundation — keep building with the path below.';
    if (score >= 80) message = 'Strong start! You can breeze through early units.';
    else if (score < 50) message = 'Great time to review basics on the learning path.';

    return (
      <View
        className="flex-1 bg-[#0a0a0a] px-6"
        style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>
        <Text className="text-center text-2xl font-extrabold text-white">Your level</Text>
        <View className="mt-10 items-center">
          <View className="h-36 w-36 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <Text className="text-5xl font-black text-emerald-400">{score}%</Text>
          </View>
          <Text className="mt-8 text-center text-lg leading-7 text-neutral-300">{message}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="mt-auto rounded-2xl bg-emerald-500 py-4 active:opacity-90">
          <Text className="text-center text-lg font-bold text-neutral-950">Back to path</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0a0a]" style={{ paddingBottom: insets.bottom + 8 }}>
      <PracticeQuiz
        title="Placement"
        questions={PLACEMENT_QUESTIONS}
        onComplete={(pct) => void onComplete(pct)}
      />
    </View>
  );
}
