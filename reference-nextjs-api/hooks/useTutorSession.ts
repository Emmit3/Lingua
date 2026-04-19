'use client';

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import { useCallback, useRef, useState } from 'react';

import { heygenSessionLanguage } from '@/lib/tutorLanguages';
import type { TutorLevel } from '@/lib/tutorPrompt';

export type TutorSessionContext = {
  targetLanguage: string;
  level: TutorLevel;
  learnerName?: string;
  reelTopic?: string;
  vocabulary?: string[];
  /** Lingua UI locale code, e.g. `de` — drives Claude explanation language + HeyGen session language */
  interfaceLocale: string;
};

/**
 * HeyGen Streaming Avatar + REPEAT mode: Claude `/api/tutor/respond` output is spoken verbatim.
 */
export function useTutorSession(getContext: () => TutorSessionContext) {
  const avatar = useRef<StreamingAvatar | null>(null);
  const getContextRef = useRef(getContext);
  getContextRef.current = getContext;

  const [sessionActive, setSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const sendToTutor = useCallback(async (userMessage: string) => {
    setLastError(null);
    if (!avatar.current) return;
    try {
      const ctx = getContextRef.current();
      const res = await fetch('/api/tutor/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          targetLanguage: ctx.targetLanguage,
          level: ctx.level,
          learnerName: ctx.learnerName,
          reelTopic: ctx.reelTopic,
          vocabulary: ctx.vocabulary,
          interfaceLocale: ctx.interfaceLocale,
        }),
      });
      const data = (await res.json()) as { response?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? `Tutor API ${res.status}`);
      }
      const text = data.response?.trim();
      if (!text) return;

      await avatar.current.speak({
        text,
        taskType: TaskType.REPEAT,
      });
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : String(e);
      setLastError(m);
    }
  }, []);

  const startSession = useCallback(async () => {
    setLastError(null);
    setIsLoading(true);
    try {
      const avatarId = process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID?.trim();
      const voiceId = process.env.NEXT_PUBLIC_HEYGEN_VOICE_ID?.trim();
      if (!avatarId || !voiceId) {
        throw new Error(
          'Set NEXT_PUBLIC_HEYGEN_AVATAR_ID and NEXT_PUBLIC_HEYGEN_VOICE_ID in .env.local',
        );
      }

      const tokenRes = await fetch('/api/tutor/token', { method: 'POST' });
      const tokenJson = (await tokenRes.json()) as { token?: string; error?: string };
      if (!tokenRes.ok) {
        throw new Error(tokenJson.error ?? 'Failed to create HeyGen token');
      }
      if (!tokenJson.token) {
        throw new Error('No token returned');
      }

      const client = new StreamingAvatar({ token: tokenJson.token });
      avatar.current = client;

      client.on(StreamingEvents.STREAM_READY, (media: MediaStream) => {
        setStream(media);
        setSessionActive(true);
      });

      client.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        setSessionActive(false);
        setStream(null);
      });

      const ctx0 = getContextRef.current();
      const sessionLanguage = heygenSessionLanguage(ctx0.interfaceLocale);

      await client.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: avatarId,
        voice: {
          voiceId,
          emotion: VoiceEmotion.FRIENDLY,
        },
        language: sessionLanguage,
        useSilencePrompt: false,
      });

      await client.startVoiceChat({ isInputAudioMuted: false });

      client.on(StreamingEvents.USER_END_MESSAGE, async (evt: unknown) => {
        const msg =
          typeof evt === 'string'
            ? evt
            : evt &&
                typeof evt === 'object' &&
                'message' in evt &&
                typeof (evt as { message?: unknown }).message === 'string'
              ? (evt as { message: string }).message
              : '';
        const trimmed = msg.trim();
        if (!trimmed) return;
        await sendToTutor(trimmed);
      });
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : String(e);
      setLastError(m);
    } finally {
      setIsLoading(false);
    }
  }, [sendToTutor]);

  const endSession = useCallback(async () => {
    try {
      await avatar.current?.stopAvatar();
    } finally {
      avatar.current = null;
      setSessionActive(false);
      setStream(null);
    }
  }, []);

  return {
    startSession,
    sendToTutor,
    endSession,
    sessionActive,
    isLoading,
    stream,
    lastError,
  };
}
