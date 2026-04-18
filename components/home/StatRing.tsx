import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  seconds: number;
  maxSeconds: number;
  size?: number;
};

function formatListening(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

export function StatRing({ seconds, maxSeconds, size = 180 }: Props) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = maxSeconds > 0 ? Math.min(1, seconds / maxSeconds) : 0;
  const sv = useSharedValue(progress);

  useEffect(() => {
    sv.value = withTiming(progress, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [progress, sv]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - sv.value),
  }));

  const cx = size / 2;
  const cy = size / 2;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G transform={`rotate(-90 ${cx} ${cy})`}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={stroke}
            fill="none"
          />
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={r}
            stroke="#FFFFFF"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View className="absolute items-center justify-center" style={{ width: size, height: size }}>
        <Text className="text-4xl font-bold text-white">{formatListening(seconds)}</Text>
        <Text className="mt-1 text-sm text-white/90">Listening Time</Text>
      </View>
    </View>
  );
}
