import 'react-native-gesture-handler';
import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, type ViewStyle } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { LocaleProvider } from '@/contexts/LocaleContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return <RootLayoutNav />;
}

const gestureRootStyle: ViewStyle =
  Platform.OS === 'web'
    ? ({ flex: 1, minHeight: '100vh' } as unknown as ViewStyle)
    : { flex: 1 };

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={gestureRootStyle}>
      <LocaleProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="settings-knot"
              options={{ title: 'Knot', headerShown: true }}
            />
          </Stack>
        </ThemeProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}
