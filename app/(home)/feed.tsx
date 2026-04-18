import { StatusBar } from 'expo-status-bar';

import { ReelFeed } from '@/components/ReelFeed';

export default function FeedScreen() {
  return (
    <>
      <StatusBar style="light" />
      <ReelFeed />
    </>
  );
}
