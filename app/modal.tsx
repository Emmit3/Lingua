import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useLocale } from '@/contexts/LocaleContext';

export default function AboutModal() {
  const { t } = useLocale();

  return (
    <>
      <Stack.Screen options={{ title: t('about.navTitle') }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t('about.title')}</Text>
        <Text style={styles.body}>{t('about.body')}</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </>
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
