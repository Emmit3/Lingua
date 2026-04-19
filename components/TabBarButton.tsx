import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Platform, Pressable } from 'react-native';

/** Web-only CSS transition (not in RN ViewStyle typings). */
const webEase = Platform.OS === 'web' ? ({ transition: 'transform 0.22s cubic-bezier(0.34, 1.45, 0.64, 1)' } as object) : {};

/**
 * Bottom tab slot with subtle hover “pop” on web and press lift on all platforms.
 * Ref is forwarded loosely so it matches react-navigation’s expectations.
 */
export const TabBarButton = React.forwardRef<any, BottomTabBarButtonProps>(
  function TabBarButton(props, ref) {
    return (
      <Pressable
        ref={ref}
        {...props}
        style={(state) => {
          const s = state as { pressed?: boolean; hovered?: boolean };
          return [
            props.style,
            (s.hovered || s.pressed) && {
              transform: [{ scale: s.pressed ? 1.04 : 1.07 }],
            },
            webEase,
          ];
        }}
      />
    );
  },
);
