import { Redirect } from 'expo-router';

import { useOnboardingStore } from '@/store/useOnboardingStore';

/** Immediate redirect — no AsyncStorage / persist gate (those caused infinite loading). */
export default function Index() {
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);

  if (onboardingComplete) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/onboarding/fluency-goal" />;
}
