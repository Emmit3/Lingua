import { useVideoPlayer, VideoView } from 'expo-video';
import { memo, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import type { ReelItemData } from '@/types/reel';

type Props = {
  item: ReelItemData;
  isActive: boolean;
  muted: boolean;
};

/** Desktop-style UA avoids Android WebView being sent to the mobile watch page instead of the embed player. */
const YOUTUBE_EMBED_WEBVIEW_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function youtubeEmbedSrc(
  videoId: string,
  embedBase: string | undefined,
  isActive: boolean,
  muted: boolean,
): string {
  if (!isActive) {
    return 'about:blank';
  }
  const idEnc = encodeURIComponent(videoId);
  const base =
    embedBase?.trim().replace(/\?.*$/, '') ||
    `https://www.youtube.com/embed/${idEnc}`;

  const params = new URLSearchParams({
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    controls: '1',
    enablejsapi: '1',
    autoplay: '1',
    /** Most mobile browsers only allow autoplay when muted. */
    mute: muted ? '1' : '0',
    /** Single-video loop requires `playlist` set to the same id. */
    loop: '1',
    playlist: videoId,
  });

  return `${base}?${params.toString()}`;
}

const ReelYoutubeEmbed = memo(function ReelYoutubeEmbed({ item, isActive, muted }: Props) {
  const id = item.youtubeVideoId!;
  const uri = youtubeEmbedSrc(id, item.youtubeEmbedUrl, isActive, muted);

  return (
    <WebView
      key={`yt-${id}-${muted ? 1 : 0}-${isActive ? 1 : 0}`}
      source={{ uri }}
      style={StyleSheet.absoluteFill}
      userAgent={YOUTUBE_EMBED_WEBVIEW_UA}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled
      domStorageEnabled
      setSupportMultipleWindows={false}
      originWhitelist={['*']}
      allowsFullscreenVideo
      {...(Platform.OS === 'android' ? { mixedContentMode: 'compatibility' as const } : {})}
    />
  );
});

const ReelExpoVideo = memo(function ReelExpoVideo({ item, isActive, muted }: Props) {
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

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      {...(Platform.OS === 'android' ? { surfaceType: 'textureView' as const } : {})}
    />
  );
});

/** Native MP4 via expo-video, or YouTube Short via embed when `youtubeVideoId` is set. */
export const ReelVideoLayer = memo(function ReelVideoLayer(props: Props) {
  if (props.item.youtubeVideoId) {
    return <ReelYoutubeEmbed {...props} />;
  }
  return <ReelExpoVideo {...props} />;
});
