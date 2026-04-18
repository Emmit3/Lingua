# Lingua platform roadmap (hackathon slice)

This document sketches how the **clickable prototype** in this repo connects to a fuller **TikTok-for-languages** stack. The app ships with **local-only** drills, saved phrases, and progress; production backends are out of scope for the first slice.

## Client app (Expo web + native)

- **Feed:** vertical reels from `EXPO_PUBLIC_REELS_URL` or `constants/mockReels.ts`, with **client-side ranking** (`lib/reelsRanking.ts`) using `show_less` reel ids and a user level preference (`lib/feedPreferenceStorage.ts`).
- **Tap-to-translate:** tokenized captions, mock ES→EN gloss (`lib/mockWordGloss.ts`), phrases in AsyncStorage (`lib/savedPhrasesStorage.ts`).
- **Drills:** lightweight modal after swipe or via **Practice** (`components/PostReelDrillModal.tsx`); results feed `lib/progressMetrics.ts`.
- **Progress tab:** demo **90-day** curve and local metrics (`app/(tabs)/progress.tsx`).
- **Knot (Web SDK):** `knotapi-js` is loaded on **web** only (`app/settings-knot.tsx`). Native opens the Knot docs URL; production would use a hosted web flow or deep link.

## Knot session (dev / demo)

The Knot Web SDK expects a **`sessionId`** from your **backend** (Create Session API). For local demos:

1. Set **`EXPO_PUBLIC_KNOT_CLIENT_ID`** to your Knot client id (Expo public env).
2. Optionally set **`EXPO_PUBLIC_KNOT_SESSION_ID`** for a fixed session in dev.
3. Or paste a session id from your backend into the field on **Profile → Keep your subscription healthy**.

Example (placeholder — use the official Knot API path and auth for your environment):

```bash
curl -sS -X POST "https://api.knotapi.com/session/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVER_SECRET" \
  -d '{"product":"card_switcher"}'
```

Paste the returned `session` / `id` into the app (or into `EXPO_PUBLIC_KNOT_SESSION_ID`). See [Knot Web SDK](https://docs.knotapi.com/sdk/web).

## LiveAvatar + streaming tutor (future)

| Piece | Role |
| ----- | ---- |
| **LiveAvatar / HeyGen-style** | Session URL + streamed video; RN/Web full-screen “call” UI. |
| **STT** | Stream user speech → text. |
| **LLM router** | Arabic → **Jais 2**; other languages / reasoning → **K2-Think**; context = last N reels + saved words. |
| **TTS** | Drive LiveAvatar lip-sync or a parallel audio track. |

**In-app placeholder:** **Practice with tutor** on the Progress tab — static copy until a hosted LiveAvatar URL exists (optional **WebView**).

## Optional env (not required for the prototype)

| Variable | Purpose |
| -------- | ------- |
| `EXPO_PUBLIC_REELS_URL` | JSON reel catalog |
| `EXPO_PUBLIC_KNOT_CLIENT_ID` | Knot client id (web) |
| `EXPO_PUBLIC_KNOT_SESSION_ID` | Dev-only default session id |
| `EXPO_PUBLIC_TRANSLATE_URL` | Future server translation endpoint |
