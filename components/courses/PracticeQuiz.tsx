import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import type { QuizQuestion } from '@/constants/coursePathway';

const ACCENT = '#58CC02';

type Props = {
  questions: QuizQuestion[];
  /** Called after the last answer, once the reveal delay finishes (0–100). */
  onComplete: (percentCorrect: number) => void;
  title?: string;
};

export function PracticeQuiz({ questions, onComplete, title }: Props) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<'pick' | 'reveal'>('pick');

  const q = questions[index];
  const total = questions.length;
  const isLast = index >= total - 1;

  const onChoose = (optionIndex: number) => {
    if (phase !== 'pick' || !q || total === 0) return;
    setPicked(optionIndex);
    setPhase('reveal');
    const ok = optionIndex === q.answerIndex;
    const nextCorrect = correctCount + (ok ? 1 : 0);
    if (ok) setCorrectCount(nextCorrect);

    const delay = ok ? 550 : 800;
    setTimeout(() => {
      if (isLast) {
        const finalCorrect = nextCorrect;
        onComplete(total > 0 ? Math.round((finalCorrect / total) * 100) : 0);
        return;
      }
      setIndex((i) => i + 1);
      setPicked(null);
      setPhase('pick');
    }, delay);
  };

  if (!q) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-neutral-500">No questions for this activity.</Text>
      </View>
    );
  }

  const progress = (index + (phase === 'reveal' ? 0.45 : 0)) / total;

  return (
    <View className="flex-1 px-5 pt-2">
      {title ? (
        <Text className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-cyan-400/90">
          {title}
        </Text>
      ) : null}
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-neutral-500">
          {index + 1} / {total}
        </Text>
        <View className="mx-3 h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${Math.min(100, progress * 100)}%`,
              backgroundColor: ACCENT,
            }}
          />
        </View>
      </View>
      <Text className="text-xl font-bold leading-8 text-neutral-50">{q.prompt}</Text>
      <View className="mt-8 gap-3">
        {q.options.map((opt, i) => {
          const selected = picked === i;
          const isCorrect = i === q.answerIndex;
          let borderClass = 'border-neutral-700';
          let bgClass = 'bg-neutral-900';
          if (phase === 'reveal') {
            if (isCorrect) {
              borderClass = 'border-emerald-500';
              bgClass = 'bg-emerald-950/55';
            } else if (selected && !isCorrect) {
              borderClass = 'border-red-500';
              bgClass = 'bg-red-950/45';
            }
          }
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              disabled={phase !== 'pick'}
              onPress={() => onChoose(i)}
              className={`rounded-2xl border-2 px-4 py-4 active:opacity-90 ${borderClass} ${bgClass}`}>
              <Text className="text-base font-semibold text-neutral-100">{opt}</Text>
            </Pressable>
          );
        })}
      </View>
      {phase === 'reveal' && isLast ? (
        <View className="mt-8 flex-row items-center justify-center gap-2">
          <ActivityIndicator color={ACCENT} />
          <Text className="text-sm text-neutral-500">Wrapping up…</Text>
        </View>
      ) : null}
    </View>
  );
}
