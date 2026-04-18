import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { APP_LOCALES, LOCALE_LABELS } from '@/constants/appLocale';
import { useLocale } from '@/contexts/LocaleContext';

/**
 * Profile — includes app language; streaks and saved reels can plug in later.
 */
export default function ProfileScreen() {
  const { locale, setLocale, t } = useLocale();
  const insets = useSafeAreaInsets();
  const contentTop = insets.top + 16;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: contentTop, paddingBottom: insets.bottom + 96 }]}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('profile.title')}</Text>
      <Text style={styles.sub}>{t('profile.subtitle')}</Text>

      <Text style={styles.sectionLabel}>{t('profile.linkSettings')}</Text>
      <Link href="/settings-knot" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.settingsRow,
            pressed && styles.rowPressed,
          ]}
          accessibilityRole="button">
          <Text style={styles.settingsRowLabel}>{t('settings.knotTitle')}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </Link>

      <Text style={styles.sectionLabel}>{t('profile.appLanguage')}</Text>
      <View style={styles.card}>
        {APP_LOCALES.map((code) => {
          const selected = code === locale;
          return (
            <Pressable
              key={code}
              onPress={() => setLocale(code)}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
                selected && styles.rowSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={LOCALE_LABELS[code]}>
              <Text
                style={[styles.rowLabel, selected && styles.rowLabelSelected]}>
                {LOCALE_LABELS[code]}
              </Text>
              {selected ? <Text style={styles.check}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    opacity: 0.55,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
  },
  settingsRowLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 22,
    fontWeight: '800',
    opacity: 0.45,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowSelected: {
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  rowLabelSelected: {
    fontWeight: '700',
  },
  check: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6366f1',
  },
});
