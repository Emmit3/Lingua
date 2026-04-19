import { Redirect, useRootNavigationState } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useOnboardingStore } from '@/store/useOnboardingStore';

/**
 * Wait for the root navigator before redirecting — avoids a blank web screen when
 * `replace()` runs before React Navigation has mounted.
 * Uses explicit `/(home)/home` so the tabs layout resolves reliably on web.
 */
export default function Index() {
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
  const rootNav = useRootNavigationState();

  if (!rootNav?.key) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8fafc]">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (onboardingComplete) {
    return <Redirect href="/(home)/home" />;
  }
  return <Redirect href="/onboarding/fluency-goal" />;
}
