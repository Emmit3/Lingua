# Lingua platform roadmap (hackathon slice)

This document sketches how the **clickable prototype** in this repo connects to a fuller **TikTok-for-languages** stack. The app ships with **local-only** drills, saved phrases, and progress; production backends are out of scope for the first slice.

**Running the app (Mac Simulator, Windows, physical iPhone):** see [DEVELOPMENT.md](./DEVELOPMENT.md).

**API server:** from repo root run `npm run dev` (starts Expo + `Lingua/backend`), or `cd Lingua/backend && npm install && npm run dev` for the Fastify process only.

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

## AI tutor + LiveAvatar (in-app)

| Route / piece | Role |
| ----- | ---- |
| **`/tutor`** (`app/tutor/index.tsx`) | Creates session via `createTutorSession()` → `AvatarView` (WebView when `sessionUrl` is http(s)). |
| **`/tutor/chat`** | Text fallback; calls `sendChatMessage` (`POST /chat` when `EXPO_PUBLIC_BACKEND_URL` is set). |
| **`TutorDrawer`** | Reel word tap / long-press: gloss + Spectrum-style explanation + **Ask more** / **Talk to tutor** + phrase save (shared `PhraseSaveSection`). |
| **`lib/tutorApi.ts`** | `createTutorSession`, `endTutorSession`, `sendChatMessage` — calls `EXPO_PUBLIC_BACKEND_URL`. |
| **`backend/`** (inside this repo) | Fastify server: `POST /chat`, Spectrum webhook, `POST /tutor/session` (LiveAvatar FULL), `GET /tutor/verify`. Env: `backend/.env.example`. |

**Env:** `EXPO_PUBLIC_BACKEND_URL` — when unset, chat returns a friendly stub and LiveAvatar session URL is empty (placeholder UI).

**Deep links:** App scheme `lingua` — e.g. `lingua://tutor?topic=subjunctive` opens `/tutor` with `topic` (handled via `useLocalSearchParams`).

## Optional env (not required for the prototype)

| Variable | Purpose |
| -------- | ------- |
| `EXPO_PUBLIC_REELS_URL` | JSON reel catalog |
| `EXPO_PUBLIC_KNOT_CLIENT_ID` | Knot client id (web) |
| `EXPO_PUBLIC_KNOT_SESSION_ID` | Dev-only default session id |
| `EXPO_PUBLIC_TRANSLATE_URL` | Future server translation endpoint |
| `EXPO_PUBLIC_BACKEND_URL` | Spectrum `/chat`, `/tutor/session`, `/tutor/session/:id/end` (see `lib/tutorApi.ts`) |
