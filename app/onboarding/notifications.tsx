import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { requestNotificationPermission } from '@/lib/photon';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const setNotificationsGranted = useOnboardingStore((s) => s.setNotificationsGranted);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const [webModal, setWebModal] = useState(Platform.OS === 'web');
  const [nativeBusy, setNativeBusy] = useState(false);

  const finish = useCallback(
    (granted: boolean) => {
      setNotificationsGranted(granted);
      completeOnboarding();
      router.replace('/home');
    },
    [completeOnboarding, router, setNotificationsGranted],
  );

  const onNativeContinue = useCallback(async () => {
    setNativeBusy(true);
    try {
      const granted = await requestNotificationPermission();
      finish(granted);
    } finally {
      setNativeBusy(false);
    }
  }, [finish]);

  return (
    <OnboardingShell>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold leading-8 text-[#121826]">
          Never miss a lesson again
        </Text>
        <Text className="mt-3 text-base text-[#6B7280]">
          86% of users hit their goals with daily reminders
        </Text>

        {Platform.OS === 'web' ? (
          <View className="mt-16 min-h-[200px]" />
        ) : (
          <View className="mt-16">
            <PrimaryButton
              title="Enable reminders"
              disabled={nativeBusy}
              onPress={onNativeContinue}
            />
            <Pressable
              accessibilityRole="button"
              className="mt-4 py-3"
              disabled={nativeBusy}
              onPress={() => finish(false)}>
              <Text className="text-center text-base font-medium text-[#6B7280]">
                Not now
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={webModal && Platform.OS === 'web'}
        transparent
        animationType="fade"
        onRequestClose={() => setWebModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/35 px-6">
          <View className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg">
            <View className="items-center border-b border-gray-200 px-4 pb-4 pt-6">
              <Text className="text-center text-lg font-semibold text-[#121826]">
                &quot;Lingua&quot; Would Like to Send You Notifications
              </Text>
              <Text className="mt-3 text-center text-sm leading-5 text-[#6B7280]">
                Notifications may include alerts, sounds and icon badges. These can be configured in
                Settings.
              </Text>
            </View>
            <View className="flex-row border-t border-gray-200">
              <Pressable
                className="flex-1 border-r border-gray-200 py-3"
                onPress={() => {
                  setWebModal(false);
                  finish(false);
                }}>
                <Text className="text-center text-base text-[#2196F3]">Don&apos;t Allow</Text>
              </Pressable>
              <Pressable
                className="flex-1 py-3"
                onPress={() => {
                  setWebModal(false);
                  finish(true);
                }}>
                <Text className="text-center text-base font-semibold text-[#2196F3]">Allow</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </OnboardingShell>
  );
}
