import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppFont } from '@/constants/appFonts';
import { Accents } from '@/constants/designTokens';
import { glossWordForLanguage } from '@/lib/mockWordGloss';
import { loadReelVocabulary } from '@/lib/reelVocabularyStorage';
import { loadSavedPhrases } from '@/lib/savedPhrasesStorage';
import { useLocale } from '@/contexts/LocaleContext';
import type { SavedPhrase } from '@/types/savedPhrase';
import type { ReelVocabularyEntry } from '@/types/reelVocabulary';

export default function DictionaryScreen() {
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const contentTop = insets.top + 16;

  const [reelWords, setReelWords] = useState<ReelVocabularyEntry[]>([]);
  const [saved, setSaved] = useState<SavedPhrase[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        setLoading(true);
        try {
          const [vocab, phrases] = await Promise.all([
            loadReelVocabulary(),
            loadSavedPhrases(),
          ]);
          if (!cancelled) {
            setReelWords(vocab);
            setSaved(phrases);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const emptyBoth = reelWords.length === 0 && saved.length === 0;

  return (
    <ScrollView
      className="hide-scrollbar"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{
        paddingTop: contentTop,
        paddingBottom: insets.bottom + 96,
        paddingHorizontal: 22,
      }}
      keyboardShouldPersistTaps="handled">
      <StatusBar style="light" />
      <Text style={styles.title}>{t('dictionary.title')}</Text>
      <Text style={styles.sub}>{t('dictionary.subtitle')}</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#a3a3a3" />
        </View>
      ) : null}

      {!loading && emptyBoth ? (
        <Text style={styles.empty}>{t('dictionary.emptyAll')}</Text>
      ) : null}

      {!loading && reelWords.length > 0 ? (
        <>
          <Text style={styles.section}>{t('dictionary.sectionReels')}</Text>
          {reelWords.map((w) => {
            const gloss = glossWordForLanguage(w.language, w.surface);
            const meta = t('dictionary.metaReels').replace(
              /\{\{count\}\}/g,
              String(w.reelCount),
            );
            return (
              <View key={`${w.language}:${w.lemma}`} style={styles.row}>
                <View style={styles.rowHead}>
                  <Text style={styles.word}>{w.surface}</Text>
                  <Text style={styles.langBadge}>{w.language}</Text>
                </View>
                {gloss ? <Text style={styles.gloss}>{gloss}</Text> : null}
                <Text style={styles.meta}>{meta}</Text>
              </View>
            );
          })}
        </>
      ) : null}

      {!loading && saved.length > 0 ? (
        <>
          <Text style={[styles.section, { marginTop: reelWords.length ? 28 : 20 }]}>
            {t('dictionary.sectionSaved')}
          </Text>
          {saved.map((p) => (
            <View key={p.id} style={styles.row}>
              <Text style={styles.word}>{p.text}</Text>
              {p.translation ? (
                <Text style={styles.gloss}>{p.translation}</Text>
              ) : null}
              <Text style={styles.metaMuted}>{p.language}</Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontFamily: AppFont.serif,
    fontSize: 28,
    fontWeight: '800',
    color: Accents.coral,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    color: '#a3a3a3',
    marginBottom: 20,
  },
  loader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: '#a3a3a3',
    marginBottom: 12,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.38)',
    marginBottom: 12,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  word: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
    flexShrink: 1,
  },
  langBadge: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#a3a3a3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gloss: {
    marginTop: 4,
    fontSize: 15,
    color: '#d4d4d4',
    fontWeight: '500',
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#737373',
    fontWeight: '600',
  },
  metaMuted: {
    marginTop: 6,
    fontSize: 12,
    color: '#737373',
  },
});
