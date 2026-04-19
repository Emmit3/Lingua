import { Platform } from 'react-native';

/** Matches `tabBarStyle` in app/(home)/_layout.tsx */
export const HOME_TAB_BAR_HEIGHT = 62;
export const HOME_TAB_BAR_BOTTOM_MARGIN = Platform.OS === 'ios' ? 20 : 12;

/** Pixels from bottom of screen to top edge of floating tab bar. */
export function homeTabBarTopFromBottom(safeBottom: number): number {
  return safeBottom + HOME_TAB_BAR_BOTTOM_MARGIN + HOME_TAB_BAR_HEIGHT;
}

/** Position Playful Momentum bottom chrome above the tab bar. */
export function reelBottomBarOffset(safeBottom: number, gapAboveTab = 10): number {
  return homeTabBarTopFromBottom(safeBottom) + gapAboveTab;
}
