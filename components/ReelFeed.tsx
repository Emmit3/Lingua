import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  type ViewToken,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MOCK_REELS, type ReelItemData } from '@/constants/mockReels';

import { ReelItem } from './ReelItem';

export function ReelFeed() {
  const insets = useSafeAreaInsets();
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);
  const [activeId, setActiveId] = useState(MOCK_REELS[0]?.id ?? '');
  const [muted, setMuted] = useState(true);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setViewport((prev) => {
      if (prev && prev.w === width && prev.h === height) return prev;
      return { w: width, h: height };
    });
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0]?.item as ReelItemData | undefined;
      if (first) setActiveId(first.id);
    },
  ).current;

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 70,
    }),
    [],
  );

  const reelHeight = viewport?.h ?? 0;
  const reelWidth = viewport?.w ?? 0;

  const renderItem: ListRenderItem<ReelItemData> = useCallback(
    ({ item }) => (
      <ReelItem
        item={item}
        isActive={item.id === activeId}
        height={reelHeight}
        width={reelWidth}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
      />
    ),
    [activeId, reelHeight, reelWidth, muted],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<ReelItemData> | null | undefined, index: number) => ({
      length: reelHeight,
      offset: reelHeight * index,
      index,
    }),
    [reelHeight],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (reelHeight <= 0) return;
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / reelHeight);
      const clip = MOCK_REELS[index];
      if (clip) setActiveId(clip.id);
    },
    [reelHeight],
  );

  const listReady = viewport && reelHeight > 0 && reelWidth > 0;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Link href="/modal" asChild>
        <Pressable
          style={[styles.aboutBtn, { top: insets.top + 6 }]}
          accessibilityRole="button"
          accessibilityLabel="About this app">
          <FontAwesome name="info-circle" size={22} color="rgba(255,255,255,0.92)" />
        </Pressable>
      </Link>
      {listReady ? (
        <FlatList
          data={MOCK_REELS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={reelHeight}
          snapToAlignment="start"
          disableIntervalMomentum
          bounces={false}
          overScrollMode="never"
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={false}
          windowSize={3}
          maxToRenderPerBatch={2}
          initialNumToRender={1}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  aboutBtn: {
    position: 'absolute',
    right: 14,
    zIndex: 10,
    padding: 8,
  },
});
