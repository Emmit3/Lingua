import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLocale } from '@/contexts/LocaleContext';
import { glossSpanishWord } from '@/lib/mockWordGloss';
import { tokenizeCaption } from '@/lib/tokenize';
import type { ReelItemData } from '@/types/reel';

type DrillMode = 'cloze' | 'pick' | 'shadow';

function modeForReel(id: string): DrillMode {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  const m = h % 3;
  return m === 0 ? 'cloze' : m === 1 ? 'pick' : 'shadow';
}

function pickWords(transcript: string): string[] {
  return tokenizeCaption(transcript)
    .filter((t) => t.type === 'word')
    .map((t) => t.text)
    .filter((w) => normalizeWord(w).length > 2);
}

function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/^[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9¿¡]+/g, '')
    .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9¿¡]+$/g, '');
}

const FAKE_EN = ['hello', 'water', 'house', 'time', 'friend', 'city'];

type Props = {
  visible: boolean;
  onClose: () => void;
  item: ReelItemData | null;
  onComplete: (correct: boolean) => void;
};

export function PostReelDrillModal({
  visible,
  onClose,
  item,
  onComplete,
}: Props) {
  const { t } = useLocale();
  const [clozeInput, setClozeInput] = useState('');
  const [pickFeedback, setPickFeedback] = useState<'idle' | 'ok' | 'bad'>(
    'idle',
  );
  const outcomeSent = useRef(false);
  const pickFirst = useRef(true);

  useEffect(() => {
    if (!visible) return;
    outcomeSent.current = false;
    pickFirst.current = true;
  }, [visible, item?.id]);

  const mode = item ? modeForReel(item.id) : 'cloze';
  const words = useMemo(
    () => (item ? pickWords(item.transcript) : []),
    [item],
  );

  const clozeTarget = useMemo(() => {
    if (!words.length) return { blank: '', answer: '' };
    const idx = Math.abs(item?.id.length ?? 0) % words.length;
    const answer = normalizeWord(words[idx] ?? '');
    return { blank: words[idx] ?? '', answer };
  }, [words, item?.id]);

  const pickQuiz = useMemo(() => {
    if (!item || words.length === 0) {
      return { word: '', correct: '', options: [] as string[] };
    }
    const wi = Math.abs((item.id.charCodeAt(0) ?? 0) + words.length) % words.length;
    const word = words[wi] ?? words[0];
    const correct =
      item.language === 'es'
        ? glossSpanishWord(word) || item.translation.slice(0, 32)
        : item.translation.slice(0, 40);
    const pool = new Set<string>([correct]);
    for (const f of FAKE_EN) pool.add(f);
    for (const w of words.slice(0, 6)) {
      const g = glossSpanishWord(w);
      if (g) pool.add(g);
    }
    const options = shuffleArr([...pool]).slice(0, 4);
    if (!options.includes(correct)) {
      options[0] = correct;
    }
    return { word, correct, options: shuffleArr(options) };
  }, [item, words]);

  const resetLocal = useCallback(() => {
    setClozeInput('');
    setPickFeedback('idle');
  }, []);

  const handleClose = useCallback(() => {
    resetLocal();
    onClose();
  }, [onClose, resetLocal]);

  const submitCloze = useCallback(() => {
    const ok =
      normalizeWord(clozeInput) === normalizeWord(clozeTarget.answer) ||
      normalizeWord(clozeInput) === normalizeWord(clozeTarget.blank);
    if (!outcomeSent.current) {
      outcomeSent.current = true;
      onComplete(ok);
    }
    handleClose();
  }, [clozeInput, clozeTarget, onComplete, handleClose]);

  const pickChoice = useCallback(
    (opt: string) => {
      const ok = opt === pickQuiz.correct;
      if (pickFirst.current) {
        pickFirst.current = false;
        outcomeSent.current = true;
        onComplete(ok);
      }
      if (ok) {
        setPickFeedback('ok');
        setTimeout(() => handleClose(), 240);
      } else {
        setPickFeedback('bad');
      }
    },
    [pickQuiz.correct, onComplete, handleClose],
  );

  const shadowDone = useCallback(() => {
    if (!outcomeSent.current) {
      outcomeSent.current = true;
      onComplete(true);
    }
    handleClose();
  }, [onComplete, handleClose]);

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{t('drill.title')}</Text>
          <Text style={styles.meta} numberOfLines={2}>
            {item.topicLocal ?? item.topic}
          </Text>

          {mode === 'cloze' ? (
            <>
              <Text style={styles.hint}>{t('drill.clozeHint')}</Text>
              <Text style={styles.prompt}>
                {item.transcript.replace(clozeTarget.blank, '____')}
              </Text>
              <TextInput
                value={clozeInput}
                onChangeText={setClozeInput}
                placeholder={t('drill.clozePlaceholder')}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                onPress={submitCloze}
                style={({ pressed }) => [
                  styles.primary,
                  pressed && { opacity: 0.9 },
                ]}>
                <Text style={styles.primaryText}>{t('drill.check')}</Text>
              </Pressable>
            </>
          ) : null}

          {mode === 'pick' ? (
            <>
              <Text style={styles.hint}>{t('drill.pickHint')}</Text>
              <Text style={styles.wordBig}>{pickQuiz.word}</Text>
              {pickQuiz.options.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => pickChoice(opt)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && { opacity: 0.92 },
                  ]}>
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
              {pickFeedback === 'bad' ? (
                <Text style={styles.feedback}>{t('drill.incorrect')}</Text>
              ) : null}
            </>
          ) : null}

          {mode === 'shadow' ? (
            <>
              <Text style={styles.hint}>{t('drill.shadowHint')}</Text>
              <Text style={styles.prompt}>{item.transcript}</Text>
              <Pressable
                onPress={shadowDone}
                style={({ pressed }) => [
                  styles.primary,
                  pressed && { opacity: 0.9 },
                ]}>
                <Text style={styles.primaryText}>{t('drill.done')}</Text>
              </Pressable>
            </>
          ) : null}

          <Pressable
            onPress={() => {
              if (!outcomeSent.current) {
                outcomeSent.current = true;
                onComplete(false);
              }
              handleClose();
            }}
            style={styles.secondary}>
            <Text style={styles.secondaryText}>{t('drill.skip')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    maxHeight: Platform.OS === 'web' ? 520 : '86%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  meta: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginBottom: 12,
  },
  hint: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    marginBottom: 10,
  },
  prompt: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  wordBig: {
    color: '#a5b4fc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    color: '#fff',
    marginBottom: 12,
  },
  primary: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 8,
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  feedback: {
    color: '#fca5a5',
    fontSize: 13,
    marginTop: 4,
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
});
