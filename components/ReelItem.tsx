import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ReelItemData } from '@/constants/mockReels';

type Props = {
  item: ReelItemData;
  isActive: boolean;
  height: number;
  width: number;
  muted: boolean;
  onToggleMute: () => void;
};

function ReelItemInner({
  item,
  isActive,
  height,
  width,
  muted,
  onToggleMute,
}: Props) {
  const insets = useSafeAreaInsets();

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

  const levelLabel = ['Beginner', 'Intermediate', 'Advanced'][item.level - 1];

  return (
    <View style={[styles.root, { height, width }]}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        {...(Platform.OS === 'android'
          ? { surfaceType: 'textureView' as const }
          : {})}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.75)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.topRow,
          { paddingTop: Math.max(insets.top, 12), paddingHorizontal: 16 },
        ]}>
        <View style={styles.topChips}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.languageLabel}</Text>
          </View>
          <View style={[styles.badge, styles.levelBadge]}>
            <Text style={styles.badgeText}>{levelLabel}</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.rightRail,
          { paddingBottom: Math.max(insets.bottom, 8) + 8 },
        ]}>
        <Pressable
          onPress={onToggleMute}
          style={({ pressed }) => [styles.railBtn, pressed && { opacity: 0.7 }]}>
          <FontAwesome
            name={muted ? 'volume-off' : 'volume-up'}
            size={26}
            color="#fff"
          />
          <Text style={styles.railLabel}>{muted ? 'Tap for sound' : 'Sound'}</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.bottomCopy,
          {
            paddingBottom: Math.max(insets.bottom, 12) + 6,
            paddingHorizontal: 16,
          },
        ]}>
        <Text style={styles.topic}>{item.topic}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.transcript}>{item.transcript}</Text>
        <Text style={styles.translation}>{item.translation}</Text>
      </View>
    </View>
  );
}

export const ReelItem = memo(ReelItemInner);

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000',
    overflow: 'hidden',
  } as ViewStyle,
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 72,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  topChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  levelBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.35)',
    borderColor: 'rgba(16, 185, 129, 0.55)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  rightRail: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  railBtn: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  railLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  bottomCopy: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  topic: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  transcript: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  translation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 21,
  },
});
