/** Instagram Reels–style: heavy bottom scrim, light top vignette, minimal color wash. */
export const FeedTheme = {
  /** Top: subtle darkening for status area */
  overlayTop: ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)'] as const,
  /** Bottom: readability for caption (classic Reels scrim) */
  overlayBottom: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.75)'] as const,
  /** Optional thin accent wash (keep low for IG look) */
  accentWash: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.15)'] as const,
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

/** Web: subtle accent tint at top only */
export function webGradientFromAccent(accentHex?: string): string {
  if (!accentHex) return FeedTheme.webOverlayGradient;
  const a = accentHex.replace('#', '');
  if (a.length !== 6) return FeedTheme.webOverlayGradient;
  const r = parseInt(a.slice(0, 2), 16);
  const g = parseInt(a.slice(2, 4), 16);
  const b = parseInt(a.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return FeedTheme.webOverlayGradient;
  return `linear-gradient(180deg, rgba(${r},${g},${b},0.25) 0%, rgba(0,0,0,0.05) 32%, rgba(0,0,0,0.4) 68%, rgba(0,0,0,0.85) 100%)`;
}
