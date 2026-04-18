import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePathname, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from './ProgressBar';

const progressMap: Record<string, number> = {
  'fluency-goal': 0.33,
  'study-time': 0.66,
  notifications: 1.0,
};

type Props = {
  children: ReactNode;
};

export function OnboardingShell({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const key = pathname.split('/').filter(Boolean).pop() ?? 'fluency-goal';
  const progress = progressMap[key] ?? 0.33;

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mx-auto w-full max-w-[390px] flex-1 px-5">
        <View className="flex-row items-center gap-2 pb-4 pt-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            className="h-10 w-10 items-center justify-center">
            <FontAwesome name="chevron-left" size={20} color="#121826" />
          </Pressable>
          <View className="min-w-0 flex-1">
            <ProgressBar progress={progress} />
          </View>
          <View className="w-10" />
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
}
