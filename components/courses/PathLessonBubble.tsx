import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, Text, View } from 'react-native';

import type { PathLesson } from '@/constants/coursePathway';

type Status = 'locked' | 'active' | 'completed';

type Props = {
  lesson: PathLesson;
  status: Status;
  accent: string;
  onPress: () => void;
};

const SIZE = 76;

export function PathLessonBubble({ lesson, status, accent, onPress }: Props) {
  const locked = status === 'locked';
  const completed = status === 'completed';
  const active = status === 'active';

  const bg = locked ? '#27272a' : completed ? accent : '#18181b';
  const border = active ? accent : locked ? '#3f3f46' : completed ? accent : '#52525b';
  const borderWidth = active ? 4 : 2;
  const iconColor = locked ? '#71717a' : completed ? '#FFFFFF' : accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={onPress}
      className="items-center active:opacity-90"
      style={{ width: SIZE + 24 }}>
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: bg,
          borderColor: border,
          borderWidth,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: active ? 0.35 : 0.2,
          shadowRadius: active ? 10 : 6,
          elevation: active ? 8 : 3,
        }}>
        {lesson.kind === 'checkpoint' ? (
          <FontAwesome
            name={completed ? 'check' : locked ? 'lock' : 'star'}
            size={28}
            color={iconColor}
          />
        ) : (
          <FontAwesome
            name={completed ? 'check' : locked ? 'lock' : 'play'}
            size={completed ? 26 : locked ? 22 : 22}
            color={iconColor}
          />
        )}
      </View>
      <Text
        className="mt-2 px-1 text-center text-xs font-bold leading-4 text-neutral-200"
        numberOfLines={2}>
        {lesson.title}
      </Text>
      {!locked ? (
        <Text className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          +{lesson.xp} xp
        </Text>
      ) : null}
    </Pressable>
  );
}
