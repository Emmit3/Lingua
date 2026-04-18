import { addMonths, format } from 'date-fns';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { GoalBadge } from '@/components/onboarding/GoalBadge';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { SliderInput } from '@/components/onboarding/SliderInput';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function FluencyGoalScreen() {
  const router = useRouter();
  const fluencyMonths = useOnboardingStore((s) => s.fluencyMonths);
  const setFluencyMonths = useOnboardingStore((s) => s.setFluencyMonths);

  const targetDate = addMonths(new Date(), fluencyMonths);
  const label = format(targetDate, 'MMMM yyyy');

  return (
    <OnboardingShell>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold leading-8 text-[#121826]">
          When do you want to be fluent in Spanish by?
        </Text>
        <Text className="mt-3 text-base text-[#6B7280]">
          Set your fluency goal. Let&apos;s make it realistic.
        </Text>

        <View className="mt-6">
          <GoalBadge>{`🇪🇸 Fluent by ${label}!`}</GoalBadge>
        </View>

        <View className="mt-10 items-center">
          <View className="h-44 w-44 items-center justify-center rounded-full border-[6px] border-brand-green bg-white">
            <Text className="text-4xl font-bold text-[#121826]">{fluencyMonths}</Text>
            <Text className="mt-1 text-base text-[#6B7280]">months</Text>
          </View>
        </View>

        <View className="mt-10">
          <SliderInput
            min={1}
            max={36}
            step={1}
            value={fluencyMonths}
            trackColor="#22C55E"
            onChange={setFluencyMonths}
          />
        </View>

        <View className="mt-auto pt-10">
          <PrimaryButton title="Continue" onPress={() => router.push('/onboarding/study-time')} />
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}
