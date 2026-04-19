'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import TutorAvatar from '@/components/tutor/TutorAvatar';
import { normalizeUiLocale } from '@/lib/tutorLanguages';
import type { TutorLevel } from '@/lib/tutorPrompt';

function isLevel(x: string | null): x is TutorLevel {
  return x === 'BEGINNER' || x === 'INTERMEDIATE' || x === 'ADVANCED';
}

export default function TutorLabClient() {
  const searchParams = useSearchParams();

  const qs = searchParams.toString();

  const { interfaceLocale, targetLanguage, level } = useMemo(() => {
    const ui = normalizeUiLocale(searchParams.get('ui'));
    const study = (searchParams.get('study') ?? 'Spanish').trim() || 'Spanish';
    const lvlRaw = searchParams.get('level');
    const lvl: TutorLevel = isLevel(lvlRaw) ? lvlRaw : 'INTERMEDIATE';
    return { interfaceLocale: ui, targetLanguage: study, level: lvl };
  }, [qs, searchParams]);

  const reelTopic = useMemo(
    () => (searchParams.get('topic') ?? 'Short-form reels & daily conversation').trim(),
    [qs, searchParams],
  );

  const vocabulary = useMemo(() => {
    const v = searchParams.get('vocab');
    if (!v?.trim()) return ['apetece', 'temporada', 'fresas'];
    return v.split(',').map((s) => s.trim()).filter(Boolean);
  }, [qs, searchParams]);

  return (
    <TutorAvatar
      interfaceLocale={interfaceLocale}
      targetLanguage={targetLanguage}
      level={level}
      reelTopic={reelTopic}
      vocabulary={vocabulary}
    />
  );
}
