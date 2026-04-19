import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppFont } from '@/constants/appFonts';
import { LOCALE_LABELS } from '@/constants/appLocale';
import { Accents } from '@/constants/designTokens';
import { DEFAULT_LEARNING_LANGUAGE } from '@/constants/learningLanguages';
import { homeTabBarTopFromBottom } from '@/constants/homeTabBar';
import { useLocale } from '@/contexts/LocaleContext';
import { loadLearningLanguage } from '@/lib/learningLanguageStorage';
import { buildTutorLabUrl } from '@/lib/tutorLabUrl';

export default function TutorScreen() {
  const { t, locale } = useLocale();
  const insets = useSafeAreaInsets();
  const contentTop = insets.top + 20;
  const tabBarTop = homeTabBarTopFromBottom(insets.bottom);
  const [studyLabel, setStudyLabel] = useState(DEFAULT_LEARNING_LANGUAGE.label);

  useFocusEffect(
    useCallback(() => {
      void loadLearningLanguage().then((lang) => {
        setStudyLabel(lang.label);
      });
    }, []),
  );

  const labUrl = useMemo(
    () => buildTutorLabUrl({ uiLocale: locale, studyLabel }),
    [locale, studyLabel],
  );

  const onOpenLab = useCallback(async () => {
    if (!labUrl) {
      Alert.alert(t('tutor.title'), t('tutor.openLabUnavailable'));
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(labUrl);
    } catch {
      Alert.alert(t('tutor.title'), t('tutor.openLabUnavailable'));
    }
  }, [labUrl, t]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: contentTop,
            paddingBottom: tabBarTop + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Ionicons name="school-outline" size={32} color="#e5e5e5" />
          </View>
          <Text style={styles.title}>{t('tutor.title')}</Text>
        </View>
        <Text style={styles.body}>{t('tutor.body')}</Text>
        <Text style={styles.langLine}>
          {LOCALE_LABELS[locale]} · {studyLabel}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => void onOpenLab()}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, !labUrl && styles.ctaMuted]}>
          <Ionicons
            name={Platform.OS === 'web' ? 'open-outline' : 'globe-outline'}
            size={20}
            color="#0a0a0a"
          />
          <Text style={[styles.ctaLabel, styles.ctaLabelSpacing]}>{t('tutor.openLab')}</Text>
        </Pressable>

        {!labUrl ? <Text style={styles.hint}>{t('tutor.openLabUnavailable')}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    marginBottom: 16,
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    textAlign: 'center',
    fontFamily: AppFont.serif,
    fontSize: 24,
    fontWeight: '600',
    color: Accents.coral,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#a3a3a3',
    marginBottom: 10,
  },
  langLine: {
    fontSize: 13,
    fontWeight: '600',
    color: '#737373',
    marginBottom: 22,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#fafafa',
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaMuted: {
    opacity: 0.55,
  },
  ctaLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0a0a',
  },
  ctaLabelSpacing: {
    marginLeft: 10,
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19,
    color: '#737373',
  },
});
