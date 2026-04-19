import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

import { API_CORS_HEADERS, corsOptions } from '@/lib/cors';
import { interfaceLanguageName, normalizeUiLocale } from '@/lib/tutorLanguages';
import { buildTutorPrompt, type TutorLevel } from '@/lib/tutorPrompt';

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: API_CORS_HEADERS });
}

export function OPTIONS() {
  return corsOptions();
}

function isLevel(x: unknown): x is TutorLevel {
  return x === 'BEGINNER' || x === 'INTERMEDIATE' || x === 'ADVANCED';
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return json(
      { error: 'Server misconfigured: ANTHROPIC_API_KEY (Claude tutor brain)' },
      500,
    );
  }

  let body: {
    userMessage?: string;
    targetLanguage?: string;
    level?: unknown;
    learnerName?: string;
    reelTopic?: string;
    vocabulary?: unknown;
    /** Lingua app locale code, e.g. `de` */
    interfaceLocale?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const userMessage = typeof body.userMessage === 'string' ? body.userMessage.trim() : '';
  if (!userMessage) {
    return json({ error: 'userMessage is required' }, 400);
  }

  const targetLanguage =
    typeof body.targetLanguage === 'string' && body.targetLanguage.trim()
      ? body.targetLanguage.trim()
      : 'Spanish';
  const level: TutorLevel = isLevel(body.level) ? body.level : 'INTERMEDIATE';
  const learnerName =
    typeof body.learnerName === 'string' ? body.learnerName.trim() : undefined;
  const reelTopic = typeof body.reelTopic === 'string' ? body.reelTopic.trim() : undefined;
  const vocabulary = Array.isArray(body.vocabulary)
    ? body.vocabulary.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : undefined;

  const interfaceLocale = normalizeUiLocale(
    typeof body.interfaceLocale === 'string' ? body.interfaceLocale : 'en',
  );
  const interfaceLanguage = interfaceLanguageName(interfaceLocale);

  const systemPrompt = buildTutorPrompt({
    targetLanguage,
    level,
    learnerName,
    reelTopic,
    vocabulary,
    interfaceLanguage,
    interfaceLocale,
  });

  const model =
    process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-20250514';

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model,
      max_tokens: 220,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const block = message.content[0];
    const response =
      block?.type === 'text' ? block.text : '';

    return json({ response: response.trim() || '…' }, 200);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Anthropic request failed';
    return json({ error: msg }, 502);
  }
}
