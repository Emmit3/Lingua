import { useEffect } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppFont } from '@/constants/appFonts';
import { Accents } from '@/constants/designTokens';

type MilestoneKind = 'streak7' | 'points50' | null;

type Props = {
  visible: boolean;
  kind: MilestoneKind;
  title: string;
  subtitle: string;
  dismissLabel: string;
  accentHex: string;
  onDismiss: () => void;
};

/** Lightweight “confetti”: short vertical bursts (no extra deps). */
function ConfettiBurst({ color }: { color: string }) {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-28, { duration: 700 }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 520 }),
        withTiming(0.9, { duration: 520 }),
      ),
      -1,
      true,
    );
  }, [opacity, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confettiDot, { backgroundColor: color }, style]}
    />
  );
}

export function MilestoneOverlay({
  visible,
  kind,
  title,
  subtitle,
  dismissLabel,
  accentHex,
  onDismiss,
}: Props) {
  if (!visible || !kind) return null;

  const dots = [
    accentHex,
    Accents.lime,
    Accents.coral,
    Accents.teal,
    Accents.purple,
    Accents.lime,
  ];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.modalFill}>
        <Pressable style={styles.backdropHit} onPress={onDismiss} />
        <Animated.View entering={FadeIn.duration(280)} style={styles.card}>
          <View style={styles.confettiRow}>
            {dots.map((c, i) => (
              <ConfettiBurst key={`${c}-${i}`} color={c} />
            ))}
          </View>
          <Text style={[styles.title, { color: accentHex }]}>{title}</Text>
          <Text style={styles.sub}>{subtitle}</Text>
          <Text style={styles.dismiss}>{dismissLabel}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalFill: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backdropHit: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    zIndex: 1,
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FAFAF8',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 12 },
      default: {},
    }),
  },
  confettiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  confettiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontFamily: AppFont.serif,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    fontFamily: AppFont.body,
    fontSize: 17,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  dismiss: {
    fontFamily: AppFont.bodySemi,
    fontSize: 14,
    color: '#6B7280',
  },
});
