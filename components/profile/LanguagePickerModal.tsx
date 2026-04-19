import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type PickerRow = {
  id: string;
  title: string;
  subtitle?: string;
  flag: string;
};

type Props = {
  visible: boolean;
  title: string;
  hint?: string;
  rows: PickerRow[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  headerIcon: ComponentProps<typeof Ionicons>['name'];
};

export function LanguagePickerModal({
  visible,
  title,
  hint,
  rows,
  selectedId,
  onSelect,
  onClose,
  headerIcon,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <View style={styles.sheetHeader}>
            <View style={styles.headerIconWrap}>
              <Ionicons name={headerIcon} size={22} color="#312e81" />
            </View>
            <View style={styles.headerTextCol}>
              <Text style={styles.sheetTitle}>{title}</Text>
              {hint ? <Text style={styles.sheetHint}>{hint}</Text> : null}
            </View>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
              <Ionicons name="close-circle" size={30} color="rgba(15,23,42,0.45)" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {rows.map((row) => {
              const selected = row.id === selectedId;
              return (
                <Pressable
                  key={row.id}
                  onPress={() => onSelect(row.id)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                    selected && styles.rowSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}>
                  <Text style={styles.flag}>{row.flag}</Text>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, selected && styles.rowTitleSelected]}>
                      {row.title}
                    </Text>
                    {row.subtitle ? (
                      <Text style={styles.rowSub} numberOfLines={1}>
                        {row.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  {selected ? (
                    <View style={styles.checkWrap}>
                      <Ionicons name="checkmark-circle" size={26} color="#4f46e5" />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="rgba(15,23,42,0.25)" />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99,102,241,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    minWidth: 0,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  sheetHint: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(15,23,42,0.55)',
  },
  list: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  rowPressed: {
    opacity: 0.92,
  },
  rowSelected: {
    borderColor: 'rgba(79,70,229,0.45)',
    backgroundColor: 'rgba(99,102,241,0.06)',
  },
  flag: {
    fontSize: 34,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  rowTitleSelected: {
    color: '#312e81',
  },
  rowSub: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(15,23,42,0.45)',
    fontWeight: '600',
  },
  checkWrap: {
    marginLeft: 4,
  },
});
