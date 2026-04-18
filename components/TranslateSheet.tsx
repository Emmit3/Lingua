import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLocale } from '@/contexts/LocaleContext';
import { glossSpanishWord } from '@/lib/mockWordGloss';
import { savePhrase, updatePhraseState } from '@/lib/savedPhrasesStorage';
import type { WordState } from '@/types/savedPhrase';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Raw tapped token */
  word: string;
  reelId: string;
  language: string;
  /** Optional full-line translation from reel */
  lineHint?: string;
  /** After phrase saved to storage (for progress sync) */
  onPhraseSaved?: () => void;
  /** When user marks "show less" for this phrase — deprioritize this reel in feed */
  onReelShowLess?: () => void;
};

export function TranslateSheet({
  visible,
  onClose,
  word,
  reelId,
  language,
  lineHint,
  onPhraseSaved,
  onReelShowLess,
}: Props) {
  const { t } = useLocale();
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setSavedId(null);
  }, [visible, word]);

  const gloss =
    language === 'es'
      ? glossSpanishWord(word) || lineHint || ''
      : lineHint || '';

  const onSave = useCallback(async () => {
    const g = gloss || t('translate.glossUnknown');
    const row = await savePhrase({
      text: word.trim(),
      translation: g,
      reelId,
      language,
    });
    setSavedId(row.id);
    onPhraseSaved?.();
  }, [word, gloss, reelId, language, t, onPhraseSaved]);

  const onPickState = useCallback(
    async (ws: WordState) => {
      if (ws === 'show_less') onReelShowLess?.();
      if (!savedId) {
        const g = gloss || t('translate.glossUnknown');
        const row = await savePhrase({
          text: word.trim(),
          translation: g,
          reelId,
          language,
          wordState: ws,
        });
        setSavedId(row.id);
        onPhraseSaved?.();
        return;
      }
      await updatePhraseState(savedId, ws);
    },
    [savedId, word, gloss, reelId, language, t, onPhraseSaved, onReelShowLess],
  );

  const displayGloss = gloss || t('translate.glossUnknown');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.label}>{t('translate.title')}</Text>
          <Text style={styles.word}>{word.trim()}</Text>
          <Text style={styles.gloss}>{displayGloss}</Text>

          <Pressable
            onPress={onSave}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.primaryText}>
              {savedId ? t('translate.saved') : t('translate.save')}
            </Text>
          </Pressable>

          <Text style={styles.stateLabel}>{t('translate.wordStateHint')}</Text>
          <View style={styles.row}>
            <Pressable
              onPress={() => void onPickState('know')}
              style={styles.chip}>
              <Text style={styles.chipText}>{t('wordState.know')}</Text>
            </Pressable>
            <Pressable
              onPress={() => void onPickState('practice_more')}
              style={styles.chip}>
              <Text style={styles.chipText}>{t('wordState.practiceMore')}</Text>
            </Pressable>
            <Pressable
              onPress={() => void onPickState('show_less')}
              style={styles.chip}>
              <Text style={styles.chipText}>{t('wordState.showLess')}</Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>{t('translate.close')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  label: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  word: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  gloss: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  stateLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    fontWeight: '600',
  },
});
