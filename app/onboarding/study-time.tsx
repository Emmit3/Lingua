import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { GoalBadge } from '@/components/onboarding/GoalBadge';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { SliderInput } from '@/components/onboarding/SliderInput';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function StudyTimeScreen() {
  const router = useRouter();
  const studyMinutes = useOnboardingStore((s) => s.studyMinutes);
  const setStudyMinutes = useOnboardingStore((s) => s.setStudyMinutes);

  const wordsPerMonth = Math.round(studyMinutes * 20);
  const showRecommended = studyMinutes === 15;

  return (
    <OnboardingShell>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold leading-8 text-[#121826]">
          How Much Time Can You Study Each Day?
        </Text>
        <Text className="mt-3 text-base text-[#6B7280]">
          Consistency matters. Even 5 minutes a day gets results.
        </Text>

        <View className="mt-6">
          <GoalBadge>{`🧠 Learn ~${wordsPerMonth} words each month`}</GoalBadge>
        </View>

        <View className="mt-12 items-center">
          <Text className="text-5xl font-bold text-[#121826]">{studyMinutes} minutes</Text>
        </View>

        <View className="relative mt-8">
          <SliderInput
            min={5}
            max={60}
            step={5}
            value={studyMinutes}
            trackColor="#2196F3"
            onChange={setStudyMinutes}
          />
          {showRecommended ? (
            <View className="absolute -bottom-8 left-0 right-0 items-center">
              <View className="rounded-full bg-[#E3F2FD] px-3 py-1">
                <Text className="text-xs font-semibold text-[#1976D2]">Recommended</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View className="mt-16">
          <PrimaryButton
            title="I'm committed"
            onPress={() => router.push('/onboarding/notifications')}
          />
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}
