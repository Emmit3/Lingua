/**
 * MVP tap-to-translate: small ES→EN map + fallback.
 * Extend with more entries or wire EXPO_PUBLIC_TRANSLATE_URL later.
 */
const MAP: Record<string, string> = {
  café: 'coffee',
  leche: 'milk',
  prefieres: 'you prefer',
  solo: 'black / alone',
  fresas: 'strawberries',
  dulces: 'sweet',
  temporada: 'in season',
  tren: 'train',
  minutos: 'minutes',
  apartaos: 'step back',
  borde: 'edge',
  viaje: 'trip',
  cenamos: 'we have dinner',
  cuentas: 'you tell',
  apetece: 'you feel like',
  mercado: 'market',
  próximo: 'next',
  cuando: 'when',
  vuelvas: 'you return',
  juntos: 'together',
  '¿': '',
};

/** Normalize a caption token for lookup / vocabulary deduplication (exported for reel vocab). */
export function normalizeCaptionWord(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9¿¡]+/g, '')
    .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9¿¡]+$/g, '');
}

export function glossSpanishWord(raw: string): string {
  const n = normalizeCaptionWord(raw);
  if (!n) return '';
  if (MAP[n]) return MAP[n];
  const lower = raw.toLowerCase();
  for (const [k, v] of Object.entries(MAP)) {
    if (lower.includes(k) && v) return v;
  }
  return '';
}

/** Best-effort gloss for dictionary rows (extend per language later). */
export function glossWordForLanguage(language: string, raw: string): string {
  const code = language.toLowerCase().slice(0, 2);
  if (code === 'es') return glossSpanishWord(raw);
  return '';
}
