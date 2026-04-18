import { Platform } from 'react-native';

/** Icon row height inside the top tab strip (below status bar). */
export const TOP_TAB_BAR_ROW_HEIGHT = Platform.OS === 'ios' ? 50 : 54;

/** Padding inside tab bar under the icon row. */
export const TOP_TAB_BAR_BOTTOM_PADDING = 8;

/** Space between tab bar bottom edge and reel overlay controls (info / mute). */
export const TOP_REEL_OVERLAY_GAP = 8;

/** Bottom edge of the top tab bar from the top of the screen. */
export function tabBarOccupiedHeight(safeTop: number): number {
  return safeTop + TOP_TAB_BAR_ROW_HEIGHT + TOP_TAB_BAR_BOTTOM_PADDING;
}

/** Y offset from screen top for info + mute (pass safe-area top inset). */
export function topReelOverlayOffset(safeTop: number): number {
  return tabBarOccupiedHeight(safeTop) + TOP_REEL_OVERLAY_GAP;
}
