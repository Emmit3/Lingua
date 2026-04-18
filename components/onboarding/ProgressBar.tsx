import { View } from 'react-native';

type Props = {
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <View className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
      <View
        className="h-full rounded-full bg-brand-blue"
        style={{ width: `${p * 100}%` }}
      />
    </View>
  );
}
