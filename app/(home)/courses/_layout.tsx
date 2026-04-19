import { Stack } from 'expo-router';

export default function CoursesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerTintColor: '#1565C0',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#FFFFFF' },
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
