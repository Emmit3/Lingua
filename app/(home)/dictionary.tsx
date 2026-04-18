import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-white px-6"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 96 }}>
      <Text className="text-2xl font-bold text-[#121826]">Dictionary</Text>
      <Text className="mt-2 text-base text-[#6B7280]">Saved words and phrases will show up here.</Text>
    </View>
  );
}
