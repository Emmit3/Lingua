import { Text, View } from 'react-native';

type Props = {
  title: string;
  /** Small label above the title (default: learning path hint). */
  eyebrow?: string;
};

export function CourseCard({ title, eyebrow = 'Courses & checkpoints' }: Props) {
  return (
    <View
      className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
      style={{ alignSelf: 'stretch' }}>
      <Text className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {eyebrow}
      </Text>
      <Text className="mt-2 text-xl font-semibold text-white">{title}</Text>
      <View className="mt-4 flex-row items-center">
        <View className="h-12 w-1 rounded-full bg-white/30" />
        <View className="ml-3 h-3 w-3 rounded-full bg-white" />
      </View>
    </View>
  );
}
