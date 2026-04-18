import { Text, View } from 'react-native';

type Props = {
  children: string;
};

export function GoalBadge({ children }: Props) {
  return (
    <View className="self-center rounded-full bg-[#E3F2FD] px-4 py-2">
      <Text className="text-center text-sm font-medium text-[#1976D2]">{children}</Text>
    </View>
  );
}
