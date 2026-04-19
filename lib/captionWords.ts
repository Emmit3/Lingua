import { tokenizeCaption } from '@/lib/tokenize';

import { normalizeCaptionWord } from '@/lib/mockWordGloss';

/**
 * Unique lemmas from a reel transcript with a readable surface form per lemma.
 */
export function lemmasFromTranscript(transcript: string): Map<string, string> {
  const out = new Map<string, string>();
  const tokens = tokenizeCaption(transcript ?? '');
  for (const t of tokens) {
    if (t.type !== 'word') continue;
    const lemma = normalizeCaptionWord(t.text);
    if (!lemma || lemma.length < 2) continue;
    if (!out.has(lemma)) {
      const surface =
        t.text.trim().replace(/\s+/g, '') || lemma;
      out.set(lemma, surface);
    }
  }
  return out;
}
