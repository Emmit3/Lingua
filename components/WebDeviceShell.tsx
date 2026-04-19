import { type ReactNode } from 'react';
import { Platform, useWindowDimensions, View, type ViewStyle } from 'react-native';

/** Matches `public/iphone-simulator.html` logical width (iPhone 15 family). */
const DEVICE_MAX_WIDTH = 393;

/** Viewports wider than this get a centered “phone column” (desktop web on Windows/Mac). */
const DESKTOP_GUTTER_BREAKPOINT = 480;

const outerDesk: ViewStyle = {
  flex: 1,
  width: '100%',
  minHeight: '100%' as unknown as number,
  alignItems: 'center',
  backgroundColor: '#0b0d12',
};

const innerDesk: ViewStyle = {
  flex: 1,
  width: '100%',
  maxWidth: DEVICE_MAX_WIDTH,
  alignSelf: 'center',
  minHeight: '100%' as unknown as number,
  backgroundColor: '#000000',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.45,
  shadowRadius: 28,
  elevation: 12,
};

const fullBleedWeb: ViewStyle = {
  flex: 1,
  width: '100%',
  minHeight: '100%' as unknown as number,
};

/**
 * On **web** + wide viewports, constrains the app to an iPhone-sized column so full-bleed
 * screens (gradients, reels) do not stretch across the whole browser. For **native**
 * phone UI on Windows, use **Android Studio + phone AVD** (`npm run phone:android`), per Expo’s environment setup — not a substitute for real iOS, which needs Simulator or EAS.
 */
export function WebDeviceShell({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  if (width < DESKTOP_GUTTER_BREAKPOINT) {
    return <View style={fullBleedWeb}>{children}</View>;
  }

  return (
    <View style={outerDesk}>
      <View style={innerDesk}>{children}</View>
    </View>
  );
}
