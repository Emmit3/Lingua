export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Lingua API proxy</h1>
      <p>
        Endpoints: <code>/api/health</code>, <code>/api/youtube/shorts</code>
      </p>
      <p style={{ color: '#555', maxWidth: 560 }}>
        Set <code>YOUTUBE_API_KEY</code> in <code>.env.local</code> (Google Cloud → enable YouTube Data API v3 →
        credentials). The Expo app only calls this host via <code>EXPO_PUBLIC_YOUTUBE_PROXY_URL</code> or{' '}
        <code>EXPO_PUBLIC_BACKEND_URL</code>.
      </p>
    </main>
  );
}
