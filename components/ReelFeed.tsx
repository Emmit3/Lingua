import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  type ViewToken,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentHexForReel } from '@/constants/designTokens';
import { MOCK_REELS } from '@/constants/mockReels';
import { TOP_REEL_OVERLAY_GAP } from '@/constants/tabBar';
import { useLocale } from '@/contexts/LocaleContext';
import {
  addShowLessReelId,
  loadShowLessReelIds,
  loadUserLevelPref,
} from '@/lib/feedPreferenceStorage';
import { loadLikedIds, saveLikedIds } from '@/lib/likesStorage';
import { cloneCatalogRound } from '@/lib/reelsFeed';
import { rankReelsForFeed } from '@/lib/reelsRanking';
import { recordWordsSeenFromReel } from '@/lib/reelVocabularyStorage';
import { loadReels } from '@/lib/reelsSource';
import { countSavedPhrases } from '@/lib/savedPhrasesStorage';
import { getUiString } from '@/lib/uiStrings';
import {
  loadProgressSnapshot,
  markMilestoneSeen,
  recordDrillResult,
  syncSavedPhraseCount,
  touchStreak,
  type ProgressSnapshot,
} from '@/lib/progressMetrics';
import { shareReel } from '@/lib/shareReel';
import { useLearningLanguageVersionStore } from '@/store/useLearningLanguageVersionStore';
import type { ReelItemData } from '@/types/reel';

import { MilestoneOverlay } from './MilestoneOverlay';
import { PostReelDrillModal } from './PostReelDrillModal';
import { ReelItem } from './ReelItem';

/** Auto “quick drill” after this many reel changes (swipes), not after every reel. */
const AUTO_DRILL_AFTER_REEL_SWIPES = 8;

export function ReelFeed() {
  const { locale, t } = useLocale();
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const learningLanguageVersion = useLearningLanguageVersionStore((s) => s.version);
  const insets = useSafeAreaInsets();
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);
  const [catalogRaw, setCatalogRaw] = useState<ReelItemData[]>(MOCK_REELS);
  const [prefs, setPrefs] = useState<{
    showLess: Set<string>;
    userLevel: 1 | 2 | 3;
  }>({ showLess: new Set(), userLevel: 2 });

  const orderedCatalog = useMemo(
    () =>
      rankReelsForFeed(catalogRaw, {
        showLessIds: prefs.showLess,
        userLevel: prefs.userLevel,
      }),
    [catalogRaw, prefs],
  );

  const orderedCatalogRef = useRef(orderedCatalog);
  orderedCatalogRef.current = orderedCatalog;

  const [reels, setReels] = useState<ReelItemData[]>(orderedCatalog);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState(MOCK_REELS[0]?.id ?? '');
  const [muted, setMuted] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedPhraseCount, setSavedPhraseCount] = useState(0);

  const [drillOpen, setDrillOpen] = useState(false);
  const [drillItem, setDrillItem] = useState<ReelItemData | null>(null);
  const [progress, setProgress] = useState<ProgressSnapshot | null>(null);
  const [milestoneKind, setMilestoneKind] = useState<
    null | 'streak7' | 'points50'
  >(null);

  const listRef = useRef<FlatList<ReelItemData>>(null);
  const appendRoundRef = useRef(0);
  const appendCooldownRef = useRef(false);
  const userHasScrolledRef = useRef(false);

  const prevActiveRef = useRef<string | null>(null);
  const autoDrillSwipesRef = useRef(0);

  useEffect(() => {
    appendRoundRef.current = 0;
    setReels(orderedCatalog);
    autoDrillSwipesRef.current = 0;
    if (orderedCatalog.length) {
      setActiveId((id) => {
        const next = orderedCatalog.some((r) => r.id === id)
          ? id
          : orderedCatalog[0].id;
        prevActiveRef.current = next;
        return next;
      });
    }
  }, [orderedCatalog]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const liked = await loadLikedIds();
      if (!cancelled) setLikedIds(liked);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void touchStreak();
  }, []);

  /** Collect vocabulary from captions of reels you view (Dictionary tab). */
  useEffect(() => {
    const reel = reels.find((r) => r.id === activeId);
    if (!reel) return;
    void recordWordsSeenFromReel(reel);
  }, [activeId, reels]);

  useEffect(() => {
    let cancelled = false;
    void loadProgressSnapshot().then((p) => {
      if (!cancelled) setProgress(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!progress || milestoneKind !== null) return;
    if (progress.streakDays >= 7 && !progress.milestoneStreak7Shown) {
      setMilestoneKind('streak7');
    } else if (progress.points >= 50 && !progress.milestonePoints50Shown) {
      setMilestoneKind('points50');
    }
  }, [progress, milestoneKind]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [showLess, userLevel, count] = await Promise.all([
        loadShowLessReelIds(),
        loadUserLevelPref(),
        countSavedPhrases(),
      ]);
      if (cancelled) return;
      setPrefs({ showLess, userLevel });
      setSavedPhraseCount(count);
      await syncSavedPhraseCount(count);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const prev = prevActiveRef.current;
    if (prev && prev !== activeId) {
      const left = reels.find((r) => r.id === prev);
      if (left) {
        autoDrillSwipesRef.current += 1;
        if (autoDrillSwipesRef.current >= AUTO_DRILL_AFTER_REEL_SWIPES) {
          autoDrillSwipesRef.current = 0;
          setDrillItem(left);
          setDrillOpen(true);
        }
      }
    }
    prevActiveRef.current = activeId;
  }, [activeId, reels]);

  const refreshFeedPrefs = useCallback(async () => {
    const [showLess, userLevel] = await Promise.all([
      loadShowLessReelIds(),
      loadUserLevelPref(),
    ]);
    setPrefs({ showLess, userLevel });
  }, []);

  const onPhraseLibraryChange = useCallback(async () => {
    const count = await countSavedPhrases();
    setSavedPhraseCount(count);
    await syncSavedPhraseCount(count);
  }, []);

  const onReelShowLessForReel = useCallback(
    async (reelId: string) => {
      await addShowLessReelId(reelId);
      await refreshFeedPrefs();
    },
    [refreshFeedPrefs],
  );

  const openDrill = useCallback((item: ReelItemData) => {
    setDrillItem(item);
    setDrillOpen(true);
  }, []);

  const closeDrill = useCallback(() => {
    setDrillOpen(false);
    setDrillItem(null);
  }, []);

  const onDrillComplete = useCallback(async (correct: boolean) => {
    const next = await recordDrillResult(correct);
    setProgress(next);
  }, []);

  const dismissMilestone = useCallback(async () => {
    if (milestoneKind === 'streak7') {
      await markMilestoneSeen('streak7');
    } else if (milestoneKind === 'points50') {
      await markMilestoneSeen('points50');
    }
    const p = await loadProgressSnapshot();
    setProgress(p);
    setMilestoneKind(null);
  }, [milestoneKind]);

  const fetchReels = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    setLoadError(null);
    try {
      const { reels: next } = await loadReels();
      const base = next.length ? next : MOCK_REELS;
      setCatalogRaw(base);
      appendRoundRef.current = 0;
      userHasScrolledRef.current = false;
      if (base.length) {
        setActiveId((id) => (base.some((r) => r.id === id) ? id : base[0].id));
      }
      if (isRefresh) {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      }
    } catch (e) {
      setLoadError(
        e instanceof Error
          ? e.message
          : getUiString(localeRef.current, 'feed.loadError'),
      );
      setCatalogRaw(MOCK_REELS);
      appendRoundRef.current = 0;
      userHasScrolledRef.current = false;
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchReels(false);
  }, [fetchReels, learningLanguageVersion]);

  const toggleLike = useCallback(async (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveLikedIds(next).catch(() => {});
      return next;
    });
  }, []);

  const onLikePress = useCallback(
    (id: string) => {
      void toggleLike(id);
    },
    [toggleLike],
  );

  const onDoubleTapLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveLikedIds(next).catch(() => {});
      return next;
    });
  }, []);

  const onSharePress = useCallback(
    (item: ReelItemData) => {
      void shareReel(item, locale);
    },
    [locale],
  );

  const onListAreaLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setViewport((prev) => {
      if (prev && prev.w === width && prev.h === height) return prev;
      return { w: Math.round(width), h: Math.round(height) };
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

  const reelHeight = viewport ? Math.max(1, viewport.h) : 1;
  const reelWidth = viewport ? Math.max(1, viewport.w) : 1;
  const overlayTop = insets.top + TOP_REEL_OVERLAY_GAP;

  const activeReel = useMemo(
    () => reels.find((r) => r.id === activeId),
    [reels, activeId],
  );
  const milestoneAccent = activeReel
    ? accentHexForReel(activeReel.language, activeReel.accentColor)
    : accentHexForReel('en');

  const appendMoreReels = useCallback(() => {
    if (orderedCatalogRef.current.length === 0) return;
    appendRoundRef.current += 1;
    const round = appendRoundRef.current;
    setReels((prev) => [
      ...prev,
      ...cloneCatalogRound(orderedCatalogRef.current, round),
    ]);
  }, []);

  const onEndReached = useCallback(() => {
    if (!userHasScrolledRef.current) return;
    if (appendCooldownRef.current) return;
    appendCooldownRef.current = true;
    appendMoreReels();
    setTimeout(() => {
      appendCooldownRef.current = false;
    }, 450);
  }, [appendMoreReels]);

  const displayCount = useCallback(
    (item: ReelItemData) => item.likeCount + (likedIds.has(item.id) ? 1 : 0),
    [likedIds],
  );

  const renderItem: ListRenderItem<ReelItemData> = useCallback(
    ({ item }) => (
      <ReelItem
        item={item}
        isActive={item.id === activeId}
        overlayTopOffset={overlayTop}
        height={reelHeight}
        width={reelWidth}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        liked={likedIds.has(item.id)}
        displayLikeCount={displayCount(item)}
        onLikePress={() => onLikePress(item.id)}
        onSharePress={() => onSharePress(item)}
        onDoubleTapLike={() => onDoubleTapLike(item.id)}
        onCommentPress={() => {}}
        savedPhraseCount={savedPhraseCount}
        onPhraseLibraryChange={() => void onPhraseLibraryChange()}
        onPracticePress={() => openDrill(item)}
        onReelShowLess={() => void onReelShowLessForReel(item.id)}
        streakDays={progress?.streakDays ?? 0}
        showFlame={(progress?.drillsCorrect ?? 0) > 0}
      />
    ),
    [
      activeId,
      overlayTop,
      reelHeight,
      reelWidth,
      muted,
      likedIds,
      displayCount,
      onLikePress,
      onSharePress,
      onDoubleTapLike,
      savedPhraseCount,
      onPhraseLibraryChange,
      openDrill,
      onReelShowLessForReel,
      progress?.streakDays,
      progress?.drillsCorrect,
    ],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<ReelItemData> | null | undefined, index: number) => ({
      length: reelHeight,
      offset: reelHeight * index,
      index,
    }),
    [reelHeight],
  );

  const syncActiveFromScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (reelHeight <= 0 || reels.length === 0) return;
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.min(
        reels.length - 1,
        Math.max(0, Math.round(y / reelHeight)),
      );
      const clip = reels[index];
      if (clip) setActiveId(clip.id);
    },
    [reelHeight, reels],
  );

  const handleListScroll = useCallback(
    (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
      userHasScrolledRef.current = true;
    },
    [],
  );

  const listReady = viewport !== null && reelHeight > 0 && reelWidth > 0;

  const onRefresh = useCallback(() => {
    void fetchReels(true);
  }, [fetchReels]);

  return (
    <View style={styles.container}>
      <View style={styles.listArea} onLayout={onListAreaLayout}>
        {listReady ? (
          <FlatList<ReelItemData>
            ref={listRef}
            data={reels}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            bounces={Platform.OS !== 'web'}
            overScrollMode="never"
            getItemLayout={getItemLayout}
            onScroll={handleListScroll}
            scrollEventThrottle={120}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews={false}
            windowSize={5}
            maxToRenderPerBatch={4}
            initialNumToRender={2}
            onMomentumScrollEnd={syncActiveFromScroll}
            onScrollEndDrag={
              Platform.OS === 'web' ? syncActiveFromScroll : undefined
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.35}
            style={styles.flatList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#00D9FF"
              />
            }
          />
        ) : null}
      </View>

      <Link href="/modal" asChild>
        <Pressable
          style={StyleSheet.flatten([
            styles.aboutBtn,
            { top: overlayTop },
          ])}
          accessibilityRole="button"
          accessibilityLabel={t('feed.aboutA11y')}>
          <FontAwesome name="info-circle" size={22} color="rgba(255,255,255,0.92)" />
        </Pressable>
      </Link>

      {loadError ? (
        <View
          style={[styles.errorBanner, { top: overlayTop + 44 }]}
          accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : null}

      <PostReelDrillModal
        visible={drillOpen}
        onClose={closeDrill}
        item={drillItem}
        onComplete={(ok) => void onDrillComplete(ok)}
        accentHex={
          drillItem
            ? accentHexForReel(drillItem.language, drillItem.accentColor)
            : undefined
        }
      />

      <MilestoneOverlay
        visible={milestoneKind !== null}
        kind={milestoneKind}
        title={
          milestoneKind === 'points50'
            ? t('milestone.points50')
            : t('milestone.streak7')
        }
        subtitle={t('milestone.keepGoing')}
        dismissLabel={t('milestone.tapDismiss')}
        accentHex={milestoneAccent}
        onDismiss={() => void dismissMilestone()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listArea: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  aboutBtn: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    padding: 8,
  },
  errorBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(180,40,40,0.85)',
  },
  errorText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
});
