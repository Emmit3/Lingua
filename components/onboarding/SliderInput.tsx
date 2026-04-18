import Slider from '@react-native-community/slider';

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
    <Slider
      style={{ width: '100%', height: 44 }}
      minimumValue={min}
      maximumValue={max}
      step={step}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor={trackColor}
      maximumTrackTintColor="#E5E7EB"
      thumbTintColor="#FFFFFF"
    />
  );
}
