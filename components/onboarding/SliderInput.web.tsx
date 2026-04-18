import React from 'react';
import { View } from 'react-native';

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  trackColor: string;
  onChange: (val: number) => void;
};

export function SliderInput({ min, max, step, value, trackColor, onChange }: Props) {
  return (
    <View className="w-full py-2">
      {React.createElement('input', {
        type: 'range',
        min,
        max,
        step,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(Number(e.target.value)),
        style: {
          width: '100%',
          height: 40,
          accentColor: trackColor,
        },
      })}
    </View>
  );
}
