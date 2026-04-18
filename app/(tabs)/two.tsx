import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

/**
 * Profile / progress placeholder — swap for auth, streaks, saved clips, etc.
 */
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You</Text>
      <Text style={styles.sub}>
        Learning streak, saved reels, and language goals will live here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  sub: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
});
