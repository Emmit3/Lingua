import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AppFont } from '@/constants/appFonts';
import { hexToRgba } from '@/constants/FeedTheme';

type Props = {
  streakDays: number;
  /** Show flame after first correct drill (lifetime). */
  showFlame: boolean;
  languageLabel: string;
  accentHex: string;
  streakStartLabel: string;
  quizSoonLabel: string;
};

export const REEL_BOTTOM_BAR_HEIGHT = 52;

function ReelBottomBarInner({
  streakDays,
  showFlame,
  languageLabel,
  accentHex,
  streakStartLabel,
  quizSoonLabel,
}: Props) {
  const pillBg = hexToRgba(accentHex, 0.14);
  const pillBorder = hexToRgba(accentHex, 0.35);
  const shadowTint = hexToRgba(accentHex, 0.2);

  return (
    <View style={styles.row} pointerEvents="box-none">
      <View
        style={[
          styles.streakPill,
          {
            backgroundColor: pillBg,
            borderColor: pillBorder,
            ...Platform.select({
              ios: {
                shadowColor: shadowTint,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
              },
              android: { elevation: 4 },
              default: {},
            }),
          },
        ]}
        accessibilityRole="summary"
        accessibilityLabel={
          streakDays === 0 ? streakStartLabel : `${streakDays} day streak`
        }>
        {showFlame && streakDays > 0 ? (
          <View accessibilityElementsHidden importantForAccessibility="no">
            <Text style={styles.flame}>🔥</Text>
          </View>
        ) : null}
        <Text
          style={[styles.streakNum, { color: accentHex }]}
          maxFontSizeMultiplier={1.4}>
          {streakDays}
        </Text>
        {streakDays === 0 ? (
          <Text style={styles.streakHint} numberOfLines={1}>
            {streakStartLabel}
          </Text>
        ) : null}
      </View>

      <View style={styles.center} pointerEvents="none">
        <Text style={styles.lang} numberOfLines={1}>
          {languageLabel}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.quizHint} numberOfLines={1}>
          {quizSoonLabel}
        </Text>
      </View>
    </View>
  );
}

export const ReelBottomBar = memo(ReelBottomBarInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    minHeight: REEL_BOTTOM_BAR_HEIGHT,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 14,
    maxWidth: '38%',
  },
  flame: {
    fontSize: 20,
    marginRight: 4,
  },
  streakNum: {
    fontFamily: AppFont.serif,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  streakHint: {
    marginLeft: 6,
    flexShrink: 1,
    fontFamily: AppFont.body,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  center: {
    position: 'absolute',
    left: '28%',
    right: '28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lang: {
    fontFamily: AppFont.bodySemi,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
  },
  right: {
    maxWidth: '34%',
    alignItems: 'flex-end',
  },
  quizHint: {
    fontFamily: AppFont.body,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
});
