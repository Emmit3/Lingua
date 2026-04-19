import { type ReactNode, useMemo } from 'react';
import { Platform, useWindowDimensions, View, type ViewStyle } from 'react-native';

/** Logical width — iPhone 15 / public/iphone-simulator.html */
const DEVICE_WIDTH = 393;

/** iPhone-ish portrait height cap (points) so the shell does not look like an infinite slab on ultrawide monitors. */
const DEVICE_MAX_HEIGHT = 874;

/**
 * Frame whenever the **browser** is wider than a real phone — many “narrow” desktop
 * windows (e.g. 420–479px) were still full-bleed when this was 480px.
 */
function useFramedLayout(windowWidth: number): boolean {
  return windowWidth > DEVICE_WIDTH + 1;
}

const outerDesk: ViewStyle = {
  flex: 1,
  width: '100%',
  minHeight: '100%' as unknown as number,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 16,
  paddingHorizontal: 12,
  backgroundColor: '#0b0d12',
};

/** Outer bezel (looks like phone body). */
const bezel: ViewStyle = {
  padding: 10,
  backgroundColor: '#141416',
  borderRadius: 44,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.08)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.55,
  shadowRadius: 36,
  elevation: 24,
  alignSelf: 'center',
};

/** Screen opening — fixed width so RN Web cannot stretch to 100vw. */
const screen: ViewStyle = {
  width: DEVICE_WIDTH,
  borderRadius: 32,
  overflow: 'hidden',
  backgroundColor: '#000000',
};

const fullBleedWeb: ViewStyle = {
  flex: 1,
  width: '100%',
  minHeight: '100%' as unknown as number,
};

/**
 * Desktop web: centered **393px** “iPhone” chassis with bezel + rounded screen.
 * Real phone browsers (width ≤ 393): full bleed.
 */
export function WebDeviceShell({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const framed = Platform.OS === 'web' && useFramedLayout(width);

  /** Fixed “phone” height so layout matches a portrait handset, scaled down if the window is short. */
  const screenHeight = useMemo(() => {
    if (!framed) return undefined;
    const h = height > 0 ? height : 812;
    return Math.min(DEVICE_MAX_HEIGHT, Math.max(568, h - 40));
  }, [framed, height]);

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  if (!framed) {
    return <View style={fullBleedWeb}>{children}</View>;
  }

  return (
    <View style={outerDesk}>
      <View style={bezel}>
        <View style={[screen, screenHeight != null && { height: screenHeight }]}>
          {/* flex + minHeight 0 so navigation fills the fixed “screen” height on web */}
          <View style={{ flex: 1, minHeight: 0, width: '100%' }}>{children}</View>
        </View>
      </View>
    </View>
  );
}
