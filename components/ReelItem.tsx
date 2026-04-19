import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback, useEffect, type ReactNode, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentHexForReel } from '@/constants/designTokens';
import {
  accentBottomWashColors,
  FeedTheme,
  hexToRgba,
  webGradientFromAccent,
} from '@/constants/FeedTheme';
import { reelBottomBarOffset } from '@/constants/homeTabBar';
import { useLocale } from '@/contexts/LocaleContext';
import { languageFlagEmoji } from '@/lib/languageMeta';
import { levelLabel } from '@/lib/uiStrings';
import { tokenizeCaption } from '@/lib/tokenize';
import type { ReelItemData } from '@/types/reel';

import { ReelBottomBar, REEL_BOTTOM_BAR_HEIGHT } from './ReelBottomBar';
import { TranslateSheet } from './TranslateSheet';

type Props = {
  item: ReelItemData;
  isActive: boolean;
  /** Distance from top of each reel to place mute (below top tab bar + gap). */
  overlayTopOffset: number;
  height: number;
  width: number;
  muted: boolean;
  onToggleMute: () => void;
  liked: boolean;
  displayLikeCount: number;
  onLikePress: () => void;
  onSharePress: () => void;
  onDoubleTapLike: () => void;
  onCommentPress?: () => void;
  /** Total saved phrases (library) — shown on rail */
  savedPhraseCount: number;
  onPhraseLibraryChange: () => void;
  onPracticePress: () => void;
  onReelShowLess: () => void;
  /** Daily streak (calendar) */
  streakDays: number;
  /** Show flame in streak pill after first lifetime correct drill */
  showFlame: boolean;
};

/** Instagram Reels–style large center heart flash on double-tap */
function IgHeartFlash({ trigger }: { trigger: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger <= 0) return;
    scale.value = 0;
    opacity.value = 0;
    scale.value = withSequence(
      withSpring(1, { damping: 12, stiffness: 200 }),
      withDelay(280, withTiming(0, { duration: 200 })),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 90 }),
      withDelay(200, withTiming(0, { duration: 320 })),
    );
  }, [trigger, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={flashStyles.wrap} pointerEvents="none">
      <Animated.View style={[flashStyles.heartBox, style]}>
        <Ionicons name="heart" size={112} color="rgba(255,255,255,0.95)" />
      </Animated.View>
    </View>
  );
}

/** Rail / chrome control: scales up on hover (web) or press; smooth CSS transition on web */
function IgPressable({
  children,
  style,
  onPress,
  accessibilityLabel,
  hitSlop,
  disabled,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  accessibilityLabel?: string;
  hitSlop?: number;
  disabled?: boolean;
}) {
  const webEase =
    Platform.OS === 'web'
      ? ({
          transition:
            'transform 0.2s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.2s ease',
        } as ViewStyle)
      : undefined;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      style={(state) => [
        styles.igPressableBase,
        (state.pressed ||
          ('hovered' in state && (state as { hovered?: boolean }).hovered)) &&
          styles.igPressablePop,
        webEase,
        style,
      ]}>
      {children}
    </Pressable>
  );
}

const flashStyles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  heartBox: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
});

function ReelItemInner({
  item,
  isActive,
  overlayTopOffset,
  height,
  width,
  muted,
  onToggleMute,
  liked,
  displayLikeCount,
  onLikePress,
  onSharePress,
  onDoubleTapLike,
  onCommentPress,
  savedPhraseCount,
  onPhraseLibraryChange,
  onPracticePress,
  onReelShowLess,
  streakDays,
  showFlame,
}: Props) {
  const { t, locale } = useLocale();
  const insets = useSafeAreaInsets();
  const [heartFlash, setHeartFlash] = useState(0);
  const [saved, setSaved] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetWord, setSheetWord] = useState('');
  const heartScale = useSharedValue(1);

  const player = useVideoPlayer({ uri: item.videoUri }, (p) => {
    p.loop = true;
    p.muted = muted;
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [isActive, player]);

  useEffect(() => {
    setSaved(false);
  }, [item.id]);

  const triggerFlash = useCallback(() => {
    setHeartFlash((n) => n + 1);
  }, []);

  const onDoubleTap = useCallback(() => {
    onDoubleTapLike();
    triggerFlash();
    heartScale.value = withSequence(withSpring(1.35), withSpring(1));
  }, [onDoubleTapLike, triggerFlash, heartScale]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(onDoubleTap)();
    });

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const onLike = useCallback(() => {
    onLikePress();
    heartScale.value = withSequence(withSpring(1.22), withSpring(1));
  }, [onLikePress, heartScale]);

  const accent = accentHexForReel(item.language, item.accentColor);
  const barBottom = reelBottomBarOffset(insets.bottom);
  const handle = item.authorHandle ?? 'lingua';
  const commentTotal = item.commentCount ?? Math.max(3, Math.floor(item.likeCount * 0.06));
  const levelLine = levelLabel(locale, item.level);

  const webGradientOverlay = StyleSheet.flatten([
    StyleSheet.absoluteFill,
    { backgroundImage: webGradientFromAccent(item.accentColor) } as any,
  ]) as ViewStyle;

  return (
    <View style={[styles.root, { height, width }]}>
      <GestureDetector gesture={doubleTap}>
        <View style={StyleSheet.absoluteFill}>
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
            {...(Platform.OS === 'android'
              ? { surfaceType: 'textureView' as const }
              : {})}
          />
        </View>
      </GestureDetector>

      {Platform.OS === 'web' ? (
        <View style={webGradientOverlay} pointerEvents="none" />
      ) : (
        <>
          <LinearGradient
            colors={[...FeedTheme.overlayTop]}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[...FeedTheme.overlayBottom]}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[
              hexToRgba(accent, 0.12),
              'transparent',
              'rgba(0,0,0,0.45)',
            ]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[...accentBottomWashColors(accent)]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </>
      )}

      <IgHeartFlash trigger={heartFlash} />

      <View
        style={[styles.bottomBarWrap, { bottom: barBottom }]}
        pointerEvents="box-none">
        <ReelBottomBar
          streakDays={streakDays}
          showFlame={showFlame}
          languageLabel={item.languageLabel}
          accentHex={accent}
          streakStartLabel={t('reel.streakStart')}
          quizSoonLabel={t('reel.quizSoon')}
        />
      </View>

      {/* Top: mute — Reels often show controls top-right */}
      <IgPressable
        onPress={onToggleMute}
        accessibilityLabel={muted ? t('reel.unmuteA11y') : t('reel.muteA11y')}
        hitSlop={12}
        style={[styles.muteTop, { top: overlayTopOffset, right: 14 }]}>
        <View style={styles.muteBubble}>
          <Ionicons
            name={muted ? 'volume-mute' : 'volume-high'}
            size={26}
            color="#fff"
          />
        </View>
      </IgPressable>

      {/* Right rail — floating icons, no pill (Instagram) */}
      <View
        style={[
          styles.rightRail,
          { paddingBottom: Math.max(insets.bottom, 10) + 4 },
        ]}>
        <IgPressable
          onPress={() => {}}
          accessibilityLabel={item.languageLabel}
          style={styles.railItem}>
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarLetter}>
                  {item.languageLabel.slice(0, 1).toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </IgPressable>

        <IgPressable onPress={onLike} style={styles.railItem}>
          <Animated.View style={heartStyle}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={34}
              color={liked ? FeedTheme.likeActive : FeedTheme.iconPrimary}
            />
          </Animated.View>
          <Text style={styles.railCount}>{formatCount(displayLikeCount)}</Text>
        </IgPressable>

        <IgPressable
          onPress={onCommentPress}
          disabled={!onCommentPress}
          style={styles.railItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="#fff" />
          <Text style={styles.railCount}>{formatCount(commentTotal)}</Text>
        </IgPressable>

        <IgPressable onPress={onSharePress} style={styles.railItem}>
          <Ionicons name="paper-plane-outline" size={28} color="#fff" />
          <Text style={styles.railMeta}>{t('reel.share')}</Text>
        </IgPressable>

        <IgPressable onPress={() => setSaved((s) => !s)} style={styles.railItem}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={30}
            color="#fff"
          />
          <Text style={styles.railMeta}>{t('reel.save')}</Text>
          <Text style={styles.railSubCount}>
            {savedPhraseCount > 99 ? '99+' : savedPhraseCount}
          </Text>
        </IgPressable>

        <IgPressable onPress={() => {}} style={styles.railItem}>
          <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
        </IgPressable>
      </View>

      {/* Bottom-left — @handle + caption (Reels) */}
      <View
        style={[
          styles.bottomBlock,
          {
            paddingBottom:
              barBottom + REEL_BOTTOM_BAR_HEIGHT + 18,
            paddingRight: 88,
          },
        ]}>
        <View style={styles.handleRow}>
          <Text style={styles.handle}>@{handle}</Text>
          <IgPressable onPress={() => {}} style={styles.followPillOuter}>
            <View style={styles.followPill}>
              <Text style={styles.followText}>{t('reel.follow')}</Text>
            </View>
          </IgPressable>
        </View>
        <Text style={styles.metaLine} numberOfLines={2}>
          {languageFlagEmoji(item.language)} · {levelLine} ·{' '}
          {item.topicLocal ?? item.topic}
        </Text>
        <Pressable
          onPress={onPracticePress}
          style={({ pressed }) => [
            styles.practiceChipOuter,
            pressed && { opacity: 0.9 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('reel.practiceA11y')}>
          <View
            style={[
              styles.practiceChip,
              { backgroundColor: hexToRgba(accent, 0.38) },
            ]}>
            <Text style={styles.practiceChipText}>{t('reel.practice')}</Text>
          </View>
        </Pressable>
        <View style={styles.captionWrap}>
          {tokenizeCaption(item.transcript).map((tok, i) =>
            tok.type === 'space' ? (
              <Text key={`s-${i}`} style={styles.caption}>
                {tok.text}
              </Text>
            ) : (
              <Pressable
                key={`w-${i}`}
                onPress={() => {
                  setSheetWord(tok.text);
                  setSheetOpen(true);
                }}
                style={({ pressed }) => [
                  styles.wordPress,
                  pressed && styles.wordPressActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={tok.text}>
                <Text style={styles.caption}>{tok.text}</Text>
              </Pressable>
            ),
          )}
        </View>
        <Text style={styles.translation} numberOfLines={3}>
          {item.translation}
        </Text>
        {item.hashtags && item.hashtags.length > 0 ? (
          <Text style={styles.tags} numberOfLines={2}>
            {item.hashtags.join('  ')}
          </Text>
        ) : null}
      </View>

      <TranslateSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        word={sheetWord}
        reelId={item.id}
        language={item.language}
        lineHint={item.translation}
        onPhraseSaved={onPhraseLibraryChange}
        onReelShowLess={onReelShowLess}
      />
    </View>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const ReelItem = memo(ReelItemInner);

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000',
    overflow: 'hidden',
  } as ViewStyle,
  bottomBarWrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 5,
  },
  muteTop: {
    position: 'absolute',
    zIndex: 6,
    padding: 4,
  },
  muteBubble: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  igPressableBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  igPressablePop: {
    transform: [{ scale: 1.07 }],
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    ...Platform.select({
      android: { elevation: 10 },
      default: {},
    }),
  },
  rightRail: {
    position: 'absolute',
    right: 2,
    bottom: 0,
    zIndex: 4,
    alignItems: 'center',
    width: 58,
  },
  avatarRing: {
    marginBottom: 14,
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  railItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  railCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  railMeta: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  railSubCount: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  bottomBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    paddingLeft: 14,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  followPillOuter: {
    marginLeft: 10,
    borderRadius: 10,
  },
  handle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  followPill: {
    marginLeft: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  followText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  metaLine: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  practiceChipOuter: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  practiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  practiceChipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  captionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  wordPress: {
    borderRadius: 4,
  },
  wordPressActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  caption: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  translation: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 18,
  },
  tags: {
    marginTop: 8,
    color: '#a5b4fc',
    fontSize: 13,
    fontWeight: '600',
  },
});
