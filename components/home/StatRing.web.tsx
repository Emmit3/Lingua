import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

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

/** Web: static ring (no Reanimated on SVG) — avoids blank-screen crashes from animated SVG. */
export function StatRing({ seconds, maxSeconds, size = 180 }: Props) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = maxSeconds > 0 ? Math.min(1, seconds / maxSeconds) : 0;
  const strokeDashoffset = c * (1 - progress);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
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
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="#FFFFFF"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ fontSize: 36, fontWeight: '700', color: '#FFFFFF' }}>
          {formatListening(seconds)}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
          Listening Time
        </Text>
      </View>
    </View>
  );
}
