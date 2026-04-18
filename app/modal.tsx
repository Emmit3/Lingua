import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function AboutModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lingua</Text>
      <Text style={styles.body}>
        Short-form language reels: swipe through clips with captions and translations.
        The active clip plays automatically; sound starts muted — tap the speaker to
        unmute. Swap `constants/mockReels.ts` for your own video URLs and transcripts.
      </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
});
