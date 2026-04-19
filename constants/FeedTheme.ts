/** Reels scrim + Playful Momentum accent wash at bottom for legibility. */
export const FeedTheme = {
  /** Top: subtle darkening for status area */
  overlayTop: ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)'] as const,
  /** Bottom: readability for caption (classic Reels scrim) */
  overlayBottom: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.22)', 'rgba(0,0,0,0.72)'] as const,
  /** Thin neutral wash */
  accentWash: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.12)'] as const,
  webOverlayGradient:
    'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.02) 38%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.82) 100%)',
  likeActive: '#ff3040',
  likeInactive: '#ffffff',
  iconPrimary: '#ffffff',
  defaultAccent: '#ffffff',
};

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(255, 255, 255, ${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Web: accent tint + dark bottom (Playful Momentum) */
export function webGradientFromAccent(accentHex?: string): string {
  if (!accentHex) return FeedTheme.webOverlayGradient;
  const a = accentHex.replace('#', '');
  if (a.length !== 6) return FeedTheme.webOverlayGradient;
  const r = parseInt(a.slice(0, 2), 16);
  const g = parseInt(a.slice(2, 4), 16);
  const b = parseInt(a.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return FeedTheme.webOverlayGradient;
  return `linear-gradient(180deg, rgba(${r},${g},${b},0.22) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.38) 62%, rgba(${Math.round(r * 0.12)},${Math.round(g * 0.12)},${Math.round(b * 0.12)},0.55) 78%, rgba(0,0,0,0.88) 100%)`;
}

/** Native: bottom-heavy accent wash (0–28% opacity) for text legibility */
export function accentBottomWashColors(accentHex: string): readonly [string, string, string] {
  const h = accentHex.replace('#', '');
  if (h.length !== 6) {
    return ['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] as const;
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return ['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] as const;
  }
  return [
    'transparent',
    hexToRgba(accentHex, 0.12),
    `rgba(${r},${g},${b},0.28)`,
  ] as const;
}
