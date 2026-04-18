import { addDays, format, isSameDay } from 'date-fns';
import { Text, View } from 'react-native';

type Props = {
  startOfWeek: Date;
  completedDays: Date[];
  today: Date;
};

export function WeekStrip({ startOfWeek, completedDays, today }: Props) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));

  return (
    <View className="flex-row justify-between px-1">
      {labels.map((label, i) => {
        const d = days[i]!;
        const isToday = isSameDay(d, today);
        const done = completedDays.some((c) => isSameDay(c, d));
        return (
          <View key={i} className="items-center" style={{ width: 36 }}>
            <Text
              className={`text-xs font-medium ${isToday ? 'text-white' : 'text-white/55'}`}>
              {label}
            </Text>
            <View
              className={`mt-1 h-8 w-8 items-center justify-center rounded-full ${
                isToday
                  ? 'bg-white'
                  : done
                    ? 'border border-dashed border-white/40 bg-white/10'
                    : 'border border-dashed border-white/25'
              }`}>
              <Text
                className={`text-xs font-semibold ${
                  isToday ? 'text-brand-blue' : done ? 'text-white/80' : 'text-white/45'
                }`}>
                {format(d, 'd')}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
