import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      style={styles.scroll}
      contentContainerStyle={{
        paddingTop: contentTop,
        paddingBottom: insets.bottom + 96,
        paddingHorizontal: 22,
      }}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('dictionary.title')}</Text>
      <Text style={styles.sub}>{t('dictionary.subtitle')}</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#2196F3" />
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
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#121826',
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 20,
  },
  loader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 12,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(17,24,39,0.45)',
    marginBottom: 12,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(17,24,39,0.08)',
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  word: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121826',
    flexShrink: 1,
  },
  langBadge: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#2196F3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gloss: {
    marginTop: 4,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  metaMuted: {
    marginTop: 6,
    fontSize: 12,
    color: '#9CA3AF',
  },
});
