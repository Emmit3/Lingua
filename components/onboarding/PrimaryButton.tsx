import { Pressable, Text, type PressableProps } from 'react-native';

type Props = PressableProps & {
  title: string;
};

export function PrimaryButton({ title, disabled, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={[
        'w-full rounded-full bg-brand-blue py-4 active:opacity-90',
        disabled ? 'opacity-50' : '',
      ].join(' ')}
      {...rest}>
      <Text className="text-center text-base font-semibold text-white">{title}</Text>
    </Pressable>
  );
}
