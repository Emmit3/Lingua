/** Split caption into word tokens and whitespace for tap-to-translate */
export type TextToken =
  | { type: 'space'; text: string }
  | { type: 'word'; text: string };

export function tokenizeCaption(text: string): TextToken[] {
  const out: TextToken[] = [];
  if (!text) return out;
  const re = /(\s+)|([^\s]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) out.push({ type: 'space', text: m[1] });
    else if (m[2]) out.push({ type: 'word', text: m[2] });
  }
  return out;
}
