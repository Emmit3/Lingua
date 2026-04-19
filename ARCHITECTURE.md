# Lingua platform roadmap (hackathon slice)

This document sketches how the **clickable prototype** in this repo connects to a fuller **TikTok-for-languages** stack. The app ships with **local-only** drills, saved phrases, and progress; production backends are out of scope for the first slice.

**Running the app (Mac Simulator, Windows web/Android, physical iPhone):** see [DEVELOPMENT.md](./DEVELOPMENT.md).

**API server (optional):** use a parent workspace that starts Expo + `Lingua/backend`, or `cd backend && npm install && npm run dev` for the Fastify process only when you have the backend checked in.

**Maya tutor (HeyGen + Claude, web lab):** the **Next** app in `reference-nextjs-api/` exposes `POST /api/tutor/token` (HeyGen one-time token) and `POST /api/tutor/respond` (Claude with `lib/tutorPrompt.ts`). **`@heygen/streaming-avatar`** on **`/tutor`** speaks tutor lines with **`TaskType.REPEAT`**. Env: `HEYGEN_API_KEY`, `NEXT_PUBLIC_HEYGEN_AVATAR_ID`, `NEXT_PUBLIC_HEYGEN_VOICE_ID`, `ANTHROPIC_API_KEY`. Native Expo would use a **WebView** to this page or call the same APIs from your backend.

## Client app (Expo web + native)

- **Profile languages:** **Interface locale** (`APP_LOCALES` + flags in `constants/appLocale.ts`, UI strings in `lib/uiStrings.ts`) and **study language** for Shorts (`constants/learningLanguages.ts`, `lib/learningLanguageStorage.ts`) — pickers in `app/(home)/profile.tsx` + `components/profile/LanguagePickerModal.tsx`. Changing study language bumps `useLearningLanguageVersionStore` so `ReelFeed` refetches.
- **Feed:** vertical shorts from **YouTube** (when `EXPO_PUBLIC_YOUTUBE_PROXY_URL` or `EXPO_PUBLIC_BACKEND_URL` is set — see `reference-nextjs-api/`), else optional JSON `EXPO_PUBLIC_REELS_URL`, else `constants/mockReels.ts`. **Client-side ranking** (`lib/reelsRanking.ts`) uses `show_less` reel ids and user level (`lib/feedPreferenceStorage.ts`). Tag hints: `EXPO_PUBLIC_YOUTUBE_FILTER_TAGS`, `lib/youtubePreferencesStorage.ts`, `lib/filterReelsByPreferredTags.ts`.
- **Tap-to-translate:** tokenized captions, mock ES→EN gloss (`lib/mockWordGloss.ts`), phrases in AsyncStorage (`lib/savedPhrasesStorage.ts`).
- **Drills:** **Interactive quizzes** (`components/PostReelDrillModal.tsx`) after roughly **every 8 reel swipes** (`components/ReelFeed.tsx`), with per-language accents (`constants/designTokens.ts`); **milestone toasts** (`components/MilestoneOverlay.tsx`) for streak/points; results in `lib/progressMetrics.ts`. **Reel rail** uses `components/ReelBottomBar.tsx` + `constants/homeTabBar.ts`.
- **Progress metrics:** local storage and aggregations in `lib/progressMetrics.ts`.
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

## AI tutor + LiveAvatar (in-app)

| Route / piece | Role |
| ----- | ---- |
| **`/tutor`** (`app/tutor/index.tsx`) | Creates session via `createTutorSession()` → `AvatarView` (WebView when `sessionUrl` is http(s)). |
| **`/tutor/chat`** | Text fallback; calls `sendChatMessage` (`POST /chat` when `EXPO_PUBLIC_BACKEND_URL` is set). |
| **`TutorDrawer`** | Reel word tap / long-press: gloss + Spectrum-style explanation + **Ask more** / **Talk to tutor** + phrase save (shared `PhraseSaveSection`). |
| **`lib/tutorApi.ts`** | `createTutorSession`, `endTutorSession`, `sendChatMessage` — calls `EXPO_PUBLIC_BACKEND_URL`. |
| **`backend/`** (when present) | Fastify server: `POST /chat`, Spectrum webhook, `POST /tutor/session` (LiveAvatar FULL), `GET /tutor/verify`. Env: `backend/.env.example`. |

**Env:** `EXPO_PUBLIC_BACKEND_URL` — when unset, chat returns a friendly stub and LiveAvatar session URL is empty (placeholder UI).

**Deep links:** App scheme `lingua` — e.g. `lingua://tutor?topic=subjunctive` opens `/tutor` with `topic` (handled via `useLocalSearchParams`).

**Future stack (reference):** LiveAvatar / HeyGen-style video, STT, LLM router (e.g. Jais 2 / K2-Think), TTS — see roadmap issues or design docs.

## Optional env (not required for the prototype)

| Variable | Purpose |
| -------- | ------- |
| `EXPO_PUBLIC_YOUTUBE_PROXY_URL` | Base URL for Next proxy (`/api/youtube/shorts`); server needs `YOUTUBE_API_KEY` |
| `EXPO_PUBLIC_YOUTUBE_SEARCH_Q` | Default YouTube search query (e.g. language + “shorts”) |
| `EXPO_PUBLIC_YOUTUBE_FILTER_TAGS` | Comma-separated tag hints for client-side filtering |
| `EXPO_PUBLIC_REEL_LANGUAGE` / `EXPO_PUBLIC_REEL_LANGUAGE_LABEL` | Labels on catalog items from YouTube |
| `EXPO_PUBLIC_REELS_URL` | Optional JSON reel catalog (no YouTube) |
| `EXPO_PUBLIC_KNOT_CLIENT_ID` | Knot client id (web) |
| `EXPO_PUBLIC_KNOT_SESSION_ID` | Dev-only default session id |
| `EXPO_PUBLIC_TRANSLATE_URL` | Future server translation endpoint |
| `EXPO_PUBLIC_BACKEND_URL` | YouTube proxy (if no `YOUTUBE_PROXY_URL`), plus Spectrum `/chat`, `/tutor/session`, `/tutor/session/:id/end` (`lib/tutorApi.ts`) |
