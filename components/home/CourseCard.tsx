import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  /** Small label above the title (default: learning path hint). */
  eyebrow?: string;
};

export function CourseCard({ title, eyebrow = 'Courses & checkpoints' }: Props) {
  return (
    <LinearGradient
      colors={['#E8E0FF', '#DDD6FE', '#C4B5FD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ alignSelf: 'stretch' }}
      className="overflow-hidden rounded-2xl p-5">
      <Text className="text-xs font-semibold uppercase tracking-wider text-violet-900/70">
        {eyebrow}
      </Text>
      <Text className="mt-2 text-xl font-bold text-violet-950">{title}</Text>
      <View className="mt-4 flex-row items-center">
        <View className="h-12 w-1 rounded-full bg-violet-400/80" />
        <View className="ml-3 h-3 w-3 rounded-full bg-violet-500" />
      </View>
    </LinearGradient>
  );
}
