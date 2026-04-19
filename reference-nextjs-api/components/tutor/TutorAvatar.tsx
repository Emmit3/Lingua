'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';

import { useTutorSession, type TutorSessionContext } from '@/hooks/useTutorSession';
import type { TutorLevel } from '@/lib/tutorPrompt';

type Props = {
  targetLanguage: string;
  level: TutorLevel;
  /** Lingua app locale (`en`, `de`, …) — tutor explanations match this language */
  interfaceLocale: string;
  reelTopic?: string;
  learnerName?: string;
  vocabulary?: string[];
};

export default function TutorAvatar({
  targetLanguage,
  level,
  interfaceLocale,
  reelTopic,
  learnerName,
  vocabulary,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [textInput, setTextInput] = useState('');

  const getContext = (): TutorSessionContext => ({
    targetLanguage,
    level,
    reelTopic,
    learnerName,
    vocabulary,
    interfaceLocale,
  });

  const { startSession, sendToTutor, endSession, sessionActive, isLoading, stream, lastError } =
    useTutorSession(getContext);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !stream) return;
    el.srcObject = stream;
    void el.play().catch(() => {});
  }, [stream]);

  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const t = textInput.trim();
    if (!t) return;
    try {
      await sendToTutor(t);
      setTextInput('');
    } catch {
      /* error surfaced via lastError in parent hook state */
    }
  };

  return (
    <div style={{ maxWidth: 420, width: '100%' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={false}
        style={{
          width: '100%',
          borderRadius: 16,
          background: '#111',
          aspectRatio: '9 / 16',
          objectFit: 'cover',
        }}
      />

      {lastError ? (
        <p style={{ color: '#b91c1c', fontSize: 14, marginTop: 8 }}>{lastError}</p>
      ) : null}

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!sessionActive ? (
          <button
            type="button"
            onClick={() => void startSession()}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              border: 'none',
              background: isLoading ? '#94a3b8' : '#2196F3',
              color: '#fff',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}>
            {isLoading ? 'Starting…' : `Start ${targetLanguage} session`}
          </button>
        ) : (
          <>
            <form onSubmit={(e) => void handleTextSubmit(e)} style={{ display: 'flex', gap: 8 }}>
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type a message…"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0d9488',
                  color: '#fff',
                  fontWeight: 600,
                }}>
                Send
              </button>
            </form>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Voice: speak after the session starts — Maya replies via the avatar (Claude + REPEAT).
            </p>
            <button
              type="button"
              onClick={() => void endSession()}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                background: '#fff',
                fontWeight: 600,
              }}>
              End session
            </button>
          </>
        )}
      </div>
    </div>
  );
}
