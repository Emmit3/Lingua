import * as Notifications from 'expo-notifications';

/**
 * Photon notification integration — stub using Expo Notifications until the Photon SDK is wired in.
 * Screens import only from this module.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDaily(hour: number, minute: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to study',
      body: 'Keep your streak alive with a quick lesson.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}
