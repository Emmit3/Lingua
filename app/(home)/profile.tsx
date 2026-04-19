import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text as ThemedText } from '@/components/Themed';
import { LanguagePickerModal, type PickerRow } from '@/components/profile/LanguagePickerModal';
import {
  APP_LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  type AppLocale,
  isAppLocale,
} from '@/constants/appLocale';
import { LEARNING_LANGUAGE_OPTIONS, type LearningLanguageOption } from '@/constants/learningLanguages';
import { useLocale } from '@/contexts/LocaleContext';
import { languageFlagEmoji } from '@/lib/languageMeta';
import { loadLearningLanguage, saveLearningLanguage } from '@/lib/learningLanguageStorage';
import { useLearningLanguageVersionStore } from '@/store/useLearningLanguageVersionStore';

export default function ProfileScreen() {
  const { locale, setLocale, t } = useLocale();
  const insets = useSafeAreaInsets();
  const contentTop = insets.top + 16;
  const bumpLearningVersion = useLearningLanguageVersionStore((s) => s.bump);

  const [learning, setLearning] = useState<LearningLanguageOption | null>(null);
  const [interfaceOpen, setInterfaceOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const l = await loadLearningLanguage();
      if (!cancelled) setLearning(l);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const interfaceRows: PickerRow[] = useMemo(
    () =>
      APP_LOCALES.map((code) => ({
        id: code,
        title: LOCALE_LABELS[code],
        subtitle: code.toUpperCase(),
        flag: LOCALE_FLAGS[code],
      })),
    [],
  );

  const studyRows: PickerRow[] = useMemo(
    () =>
      LEARNING_LANGUAGE_OPTIONS.map((o) => ({
        id: o.code,
        title: o.label,
        subtitle: `${o.youtubeQuery} ${o.youtubeShortHashtags}`.trim(),
        flag: languageFlagEmoji(o.code),
      })),
    [],
  );

  const onPickInterface = useCallback(
    (id: string) => {
      if (isAppLocale(id)) {
        setLocale(id);
      }
      setInterfaceOpen(false);
    },
    [setLocale],
  );

  const onPickStudy = useCallback(
    async (id: string) => {
      const opt = LEARNING_LANGUAGE_OPTIONS.find((o) => o.code === id);
      if (opt) {
        await saveLearningLanguage(opt);
        setLearning(opt);
        bumpLearningVersion();
      }
      setStudyOpen(false);
    },
    [bumpLearningVersion],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: contentTop, paddingBottom: insets.bottom + 96 },
      ]}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('profile.title')}</Text>
      <Text style={styles.sub}>{t('profile.subtitle')}</Text>

      <View style={styles.sectionHead}>
        <View style={styles.sectionIcon}>
          <FontAwesome name="credit-card" size={16} color="#4338ca" />
        </View>
        <ThemedText style={styles.sectionLabel}>{t('profile.linkSettings')}</ThemedText>
      </View>
      <Link href="/settings-knot" asChild>
        <Pressable
          style={({ pressed }) => [styles.menuCard, pressed && styles.rowPressed]}
          accessibilityRole="button">
          <View style={styles.menuRow}>
            <View style={styles.menuLead}>
              <Ionicons name="wallet-outline" size={22} color="#312e81" />
              <Text style={styles.menuTitle}>{t('settings.knotTitle')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(0,0,0,0.28)" />
          </View>
        </Pressable>
      </Link>

      <View style={[styles.sectionHead, { marginTop: 28 }]}>
        <View style={styles.sectionIcon}>
          <Ionicons name="color-wand-outline" size={18} color="#4338ca" />
        </View>
        <Text style={styles.sectionLabel}>{t('profile.appInterface')}</Text>
      </View>
      <Pressable
        onPress={() => setInterfaceOpen(true)}
        style={({ pressed }) => [styles.menuCard, pressed && styles.rowPressed]}
        accessibilityRole="button"
        accessibilityLabel={t('profile.appInterface')}>
        <View style={styles.menuRow}>
          <View style={styles.menuLead}>
            <Text style={styles.menuFlag}>{LOCALE_FLAGS[locale]}</Text>
            <View>
              <Text style={styles.menuTitle}>{LOCALE_LABELS[locale]}</Text>
              <Text style={styles.menuSub}>{t('profile.appLanguage')}</Text>
            </View>
          </View>
          <View style={styles.changePill}>
            <Ionicons name="color-wand-outline" size={16} color="#4f46e5" />
            <Text style={styles.changePillText}>{t('profile.change')}</Text>
          </View>
        </View>
      </Pressable>

      <View style={[styles.sectionHead, { marginTop: 28 }]}>
        <View style={styles.sectionIcon}>
          <Ionicons name="earth-outline" size={18} color="#4338ca" />
        </View>
        <Text style={styles.sectionLabel}>{t('profile.learningLanguage')}</Text>
      </View>
      <Pressable
        onPress={() => setStudyOpen(true)}
        disabled={!learning}
        style={({ pressed }) => [
          styles.menuCard,
          pressed && styles.rowPressed,
          !learning && { opacity: 0.6 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t('profile.learningLanguage')}>
        <View style={styles.menuRow}>
          <View style={styles.menuLead}>
            <Text style={styles.menuFlag}>{learning ? languageFlagEmoji(learning.code) : '🌐'}</Text>
            <View>
              <Text style={styles.menuTitle}>{learning?.label ?? '…'}</Text>
              <Text style={styles.menuSub} numberOfLines={1}>
                {learning ? `${learning.code.toUpperCase()} · Shorts` : ''}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={22} color="rgba(0,0,0,0.35)" />
        </View>
      </Pressable>
      <Text style={styles.hint}>{t('profile.languageMenuHint')}</Text>

      <LanguagePickerModal
        visible={interfaceOpen}
        title={t('profile.appInterface')}
        hint={t('profile.interfaceHint')}
        rows={interfaceRows}
        selectedId={locale}
        onSelect={onPickInterface}
        onClose={() => setInterfaceOpen(false)}
        headerIcon="language"
      />

      <LanguagePickerModal
        visible={studyOpen}
        title={t('profile.learningLanguage')}
        hint={t('profile.studyLanguageHint')}
        rows={studyRows}
        selectedId={learning?.code ?? ''}
        onSelect={(id) => void onPickStudy(id)}
        onClose={() => setStudyOpen(false)}
        headerIcon="school"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.78,
    marginBottom: 8,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(99,102,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    opacity: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(99,102,241,0.22)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  menuFlag: {
    fontSize: 36,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  menuSub: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.48,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  changePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 0.3,
  },
  rowPressed: {
    opacity: 0.88,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.52,
    paddingHorizontal: 2,
  },
});
