import Ionicons from '@expo/vector-icons/Ionicons';
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
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppFont } from '@/constants/appFonts';
import {
  Accents,
  defaultAccentHex,
  quizDimColor,
} from '@/constants/designTokens';
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
  accentHex?: string;
};

export function PostReelDrillModal({
  visible,
  onClose,
  item,
  onComplete,
  accentHex = defaultAccentHex,
}: Props) {
  const { t } = useLocale();
  const [clozeInput, setClozeInput] = useState('');
  const [selectedPick, setSelectedPick] = useState<string | null>(null);
  const [pickPhase, setPickPhase] = useState<
    'idle' | 'correct' | 'wrong1' | 'wrong2'
  >('idle');
  const [clozeFeedback, setClozeFeedback] = useState<'idle' | 'ok' | 'bad'>(
    'idle',
  );
  const outcomeSent = useRef(false);
  const sheetTranslate = useSharedValue(420);
  const sheetOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const flashTone = useSharedValue(0);
  const floatOpacity = useSharedValue(0);
  const floatTranslateY = useSharedValue(0);

  const resetLocal = useCallback(() => {
    setClozeInput('');
    setSelectedPick(null);
    setPickPhase('idle');
    setClozeFeedback('idle');
  }, []);

  useEffect(() => {
    if (!visible) return;
    outcomeSent.current = false;
    resetLocal();
  }, [visible, item?.id, resetLocal]);

  useEffect(() => {
    if (visible) {
      sheetTranslate.value = 420;
      sheetOpacity.value = 0;
      backdropOpacity.value = 0;
      backdropOpacity.value = withTiming(1, { duration: 200 });
      sheetOpacity.value = withTiming(1, { duration: 280 });
      sheetTranslate.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180 });
      sheetTranslate.value = withTiming(420, {
        duration: 240,
        easing: Easing.in(Easing.cubic),
      });
      sheetOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, backdropOpacity, sheetOpacity, sheetTranslate]);

  const runShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 40 }),
      withTiming(10, { duration: 40 }),
      withTiming(-8, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );
  }, [shakeX]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    opacity: sheetOpacity.value,
    transform: [{ translateY: sheetTranslate.value }, { translateX: shakeX.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashTone.value,
  }));

  const floatStyle = useAnimatedStyle(() => ({
    opacity: floatOpacity.value,
    transform: [{ translateY: floatTranslateY.value }],
  }));

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

  const handleClose = useCallback(() => {
    resetLocal();
    onClose();
  }, [onClose, resetLocal]);

  const triggerCorrectCelebration = useCallback(() => {
    flashTone.value = withSequence(
      withTiming(0.45, { duration: 50 }),
      withTiming(0, { duration: 220 }),
    );
    floatTranslateY.value = 24;
    floatOpacity.value = 0;
    floatOpacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withDelay(700, withTiming(0, { duration: 400 })),
    );
    floatTranslateY.value = withTiming(-72, { duration: 1100 });
  }, [flashTone, floatOpacity, floatTranslateY]);

  const submitCloze = useCallback(() => {
    const ok =
      normalizeWord(clozeInput) === normalizeWord(clozeTarget.answer) ||
      normalizeWord(clozeInput) === normalizeWord(clozeTarget.blank);
    if (ok) {
      setClozeFeedback('ok');
      triggerCorrectCelebration();
      if (!outcomeSent.current) {
        outcomeSent.current = true;
        onComplete(true);
      }
      setTimeout(() => handleClose(), 2000);
      return;
    }
    setClozeFeedback('bad');
    runShake();
    if (!outcomeSent.current) {
      outcomeSent.current = true;
      onComplete(false);
    }
  }, [
    clozeInput,
    clozeTarget,
    onComplete,
    handleClose,
    triggerCorrectCelebration,
    runShake,
  ]);

  const pickChoice = useCallback(
    (opt: string) => {
      if (pickPhase === 'correct' || pickPhase === 'wrong2') return;
      setSelectedPick(opt);
      const ok = opt === pickQuiz.correct;
      if (ok) {
        setPickPhase('correct');
        triggerCorrectCelebration();
        if (!outcomeSent.current) {
          outcomeSent.current = true;
          onComplete(true);
        }
        setTimeout(() => handleClose(), 2000);
        return;
      }
      if (pickPhase === 'idle') {
        setPickPhase('wrong1');
        runShake();
        return;
      }
      if (pickPhase === 'wrong1') {
        setPickPhase('wrong2');
        runShake();
        if (!outcomeSent.current) {
          outcomeSent.current = true;
          onComplete(false);
        }
      }
    },
    [
      pickQuiz.correct,
      pickPhase,
      onComplete,
      handleClose,
      triggerCorrectCelebration,
      runShake,
    ],
  );

  const shadowDone = useCallback(() => {
    if (!outcomeSent.current) {
      outcomeSent.current = true;
      onComplete(true);
    }
    triggerCorrectCelebration();
    setTimeout(() => handleClose(), 1600);
  }, [onComplete, handleClose, triggerCorrectCelebration]);

  const dimColor = quizDimColor(accentHex);

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdropFill, { backgroundColor: dimColor }, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, sheetAnimStyle, { borderColor: `${accentHex}44` }]}
          pointerEvents="box-none">
          <View style={styles.sheetInner}>
            <Text style={[styles.questionTitle, { color: accentHex }]}>
              {t('drill.title')}
            </Text>
            <Text style={styles.meta} numberOfLines={2}>
              {item.topicLocal ?? item.topic}
            </Text>
            <View style={styles.divider} />

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
                  placeholderTextColor={NeutralsMuted}
                  style={[
                    styles.inputUnderline,
                    {
                      borderBottomColor: accentHex,
                      color: '#1A1A1A',
                      minHeight: 48,
                    },
                  ]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {clozeTarget.blank ? (
                  <Text style={styles.charHint}>{clozeTarget.blank.length}</Text>
                ) : null}
                {clozeFeedback === 'bad' ? (
                  <Text style={styles.correction}>
                    {t('drill.correctAnswerIs')}{' '}
                    <Text style={{ color: accentHex, fontWeight: '700' }}>
                      {clozeTarget.blank}
                    </Text>
                  </Text>
                ) : null}
                <Pressable
                  onPress={submitCloze}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: accentHex },
                    pressed && { opacity: 0.92 },
                  ]}>
                  <Text style={styles.primaryBtnText}>{t('drill.check')}</Text>
                </Pressable>
              </>
            ) : null}

            {mode === 'pick' ? (
              <>
                <Text style={styles.hint}>{t('drill.pickHint')}</Text>
                <Text style={[styles.wordBig, { color: accentHex }]}>
                  {pickQuiz.word}
                </Text>
                {pickQuiz.options.map((opt, i) => {
                  const selected = selectedPick === opt;
                  const showCorrect =
                    pickPhase !== 'idle' && opt === pickQuiz.correct;
                  const showWrong =
                    selected && !showCorrect && pickPhase !== 'idle';
                  return (
                    <Animated.View
                      key={opt}
                      entering={FadeInDown.delay(i * 50).duration(220)}>
                      <Pressable
                        onPress={() => pickChoice(opt)}
                        style={({ pressed }) => [
                          styles.option,
                          {
                            borderColor: showCorrect
                              ? Accents.lime
                              : showWrong
                                ? '#F87171'
                                : accentHex,
                            backgroundColor: showCorrect
                              ? Accents.lime
                              : showWrong
                                ? '#FFE5E5'
                                : selected
                                  ? `${accentHex}4D`
                                  : 'transparent',
                            borderWidth: 2,
                            minHeight: 56,
                            transform: pressed ? [{ scale: 0.98 }] : undefined,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.optionText,
                            showCorrect && { color: '#fff', fontWeight: '800' },
                            showWrong && { color: '#991B1B' },
                          ]}>
                          {opt}
                        </Text>
                        {showCorrect ? (
                          <Ionicons name="checkmark-circle" size={22} color="#fff" />
                        ) : null}
                      </Pressable>
                    </Animated.View>
                  );
                })}
                {pickPhase === 'wrong1' ? (
                  <Text style={styles.feedbackWarn}>{t('drill.tryOnceMore')}</Text>
                ) : null}
                {pickPhase === 'wrong2' ? (
                  <Text style={styles.correction}>
                    {t('drill.correctAnswerIs')}{' '}
                    <Text style={{ color: accentHex, fontWeight: '700' }}>
                      {pickQuiz.correct}
                    </Text>
                  </Text>
                ) : null}
                {pickPhase === 'correct' ? (
                  <Animated.View entering={FadeIn} style={styles.celebrateRow}>
                    <Ionicons name="checkmark-done" size={28} color={Accents.lime} />
                    <Text style={styles.celebrateText}>{t('drill.correct')}</Text>
                  </Animated.View>
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
                    styles.primaryBtn,
                    { backgroundColor: accentHex },
                    pressed && { opacity: 0.92 },
                  ]}>
                  <Text style={styles.primaryBtnText}>{t('drill.done')}</Text>
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
          </View>

          <Animated.View
            pointerEvents="none"
            style={[styles.flashOverlay, flashStyle, { backgroundColor: Accents.lime }]}
          />
          <Animated.View style={[styles.pointsFloat, floatStyle]} pointerEvents="none">
            <Text style={[styles.pointsFloatText, { color: Accents.lime }]}>
              {t('drill.pointsPlus')}
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const NeutralsMuted = 'rgba(107,114,128,0.95)';

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    marginHorizontal: 12,
    marginBottom: Platform.OS === 'ios' ? 28 : 16,
    maxHeight: '85%',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FAFAF8',
    overflow: 'hidden',
  },
  sheetInner: {
    padding: 16,
    paddingBottom: 20,
  },
  questionTitle: {
    fontFamily: AppFont.bodyBold,
    fontSize: 22,
    marginBottom: 4,
  },
  meta: {
    color: NeutralsMuted,
    fontSize: 14,
    marginBottom: 8,
    fontFamily: AppFont.body,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  hint: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: AppFont.body,
  },
  prompt: {
    color: '#1A1A1A',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: AppFont.body,
  },
  wordBig: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    fontFamily: AppFont.display,
  },
  inputUnderline: {
    borderBottomWidth: 2,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    paddingHorizontal: 0,
    fontSize: 18,
    fontFamily: AppFont.body,
  },
  charHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: AppFont.body,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: AppFont.body,
    flex: 1,
  },
  feedbackWarn: {
    color: '#B45309',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: AppFont.bodySemi,
  },
  correction: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: AppFont.body,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    fontFamily: AppFont.bodyBold,
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: AppFont.bodySemi,
  },
  celebrateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  celebrateText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: AppFont.bodyBold,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  pointsFloat: {
    position: 'absolute',
    top: '36%',
    alignSelf: 'center',
    opacity: 0,
  },
  pointsFloatText: {
    fontFamily: AppFont.display,
    fontSize: 36,
    fontWeight: '700',
  },
});
