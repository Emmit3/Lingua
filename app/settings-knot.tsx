import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { tabBarOccupiedHeight } from '@/constants/tabBar';
import { useLocale } from '@/contexts/LocaleContext';

export default function KnotSettingsScreen() {
  const { t } = useLocale();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const contentTop = tabBarOccupiedHeight(insets.top) + 12;

  const [session, setSession] = useState('');
  const [busy, setBusy] = useState(false);

  const clientId = useMemo(
    () => process.env.EXPO_PUBLIC_KNOT_CLIENT_ID ?? '',
    [],
  );
  const envSession = useMemo(
    () => process.env.EXPO_PUBLIC_KNOT_SESSION_ID ?? '',
    [],
  );

  const openKnot = useCallback(async () => {
    const sid = session.trim() || envSession.trim();
    if (!clientId) {
      Alert.alert(t('settings.knotTitle'), t('settings.knotClientMissing'));
      return;
    }
    if (!sid) {
      Alert.alert(t('settings.knotTitle'), t('settings.knotSessionMissing'));
      return;
    }
    if (Platform.OS !== 'web') {
      await Linking.openURL('https://docs.knotapi.com/sdk/web');
      return;
    }
    setBusy(true);
    try {
      const mod = await import('knotapi-js');
      const Knot = mod.default;
      const k = new Knot();
      k.open({
        clientId,
        environment: 'sandbox',
        sessionId: sid,
        onSuccess: () => {
          Alert.alert(t('settings.knotTitle'), 'Knot: success');
        },
        onError: (err) => {
          Alert.alert(
            t('settings.knotTitle'),
            err.errorDescription ?? err.errorCode ?? 'Error',
          );
        },
        onEvent: () => {},
      });
    } catch (e) {
      Alert.alert(
        t('settings.knotTitle'),
        e instanceof Error ? e.message : 'Failed to load Knot SDK',
      );
    } finally {
      setBusy(false);
    }
  }, [clientId, envSession, session, t]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: contentTop }]}>
      <Text style={styles.title}>{t('settings.knotTitle')}</Text>
      <Text style={styles.sub}>{t('settings.knotSubtitle')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.languageSpend')}</Text>
        <Text style={styles.cardValue}>$42 (demo)</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.cardExpiry')}</Text>
        <Text style={styles.cardValue}>—</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.oneTap')}</Text>
        <Text style={styles.cardValue}>{t('settings.mockDisclaimer')}</Text>
      </View>

      <Text style={styles.hint}>{t('settings.knotStubHint')}</Text>
      <TextInput
        value={session}
        onChangeText={setSession}
        placeholder="session id"
        placeholderTextColor="rgba(128,128,128,0.8)"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable
        disabled={busy}
        onPress={() => void openKnot()}
        style={({ pressed }) => [
          styles.primary,
          (pressed || busy) && { opacity: 0.88 },
        ]}>
        <Text style={styles.primaryText}>{t('settings.knotCta')}</Text>
      </Pressable>

      <Pressable
        onPress={() => void Linking.openURL('https://docs.knotapi.com/sdk/web')}
        style={styles.linkBtn}>
        <Text style={styles.linkText}>{t('settings.knotDocs')}</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>{t('settings.back')}</Text>
      </Pressable>
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
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.65,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.45)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  primary: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  linkBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  linkText: {
    color: '#6366f1',
    fontWeight: '700',
    fontSize: 15,
  },
  backBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.75,
  },
});
