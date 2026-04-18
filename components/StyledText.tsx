import { Platform } from 'react-native';

import { Text, TextProps } from './Themed';

/** System monospace — SpaceMono asset was removed from the repo (useFonts hung without it). */
export function MonoText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontFamily: Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            default: 'monospace',
          }),
        },
      ]}
    />
  );
}
