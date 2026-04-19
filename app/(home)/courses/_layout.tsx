import { Stack } from 'expo-router';

export default function CoursesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerTintColor: '#fafafa',
        headerTitleStyle: { fontWeight: '700', color: '#fafafa' },
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#0a0a0a' },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="placement"
        options={{
          title: 'Placement test',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lesson' }} />
    </Stack>
  );
}
