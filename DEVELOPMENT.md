# Development: Web, iPhone Simulator (Mac), and Windows

This app is **one Expo codebase**. You choose **how** you run it—not different projects.

| macOS “Xcode stack” | What it gives you | **Windows / Linux best analogue** | Command (this repo) |
|---------------------|-------------------|-----------------------------------|------------------------|
| **Xcode + iOS Simulator** | Native iOS binary, phone chrome, gestures, native modules | **Android Studio + phone AVD + Expo** — same idea: **native** app in a **virtual phone** | `npm run phone:android` (after AVD is running) or `npm run android` |
| Safari / WebKit on device | Layout check in real mobile browser | **Chrome / Edge** + in-app **web phone column** (`WebDeviceShell`, ≥480px wide) | `npm run web` |
| Physical iPhone via USB / network | Real hardware | **Physical Android** or **physical iPhone** (Expo Go / dev client) | `npm run dev` → scan QR, or `npm run dev:tunnel` |

**Important:** There is **no supported “Xcode for Windows” or iOS Simulator for Windows** (Apple only ships Simulator with Xcode on macOS). Expo’s own workflow treats **Android Emulator** as the cross-platform way to iterate on **native** UI on a PC — see [Expo: Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/). **Web** stays useful for fast JS iteration but is **not** the iOS Simulator. **Real iOS** builds still need a Mac (local Simulator / Xcode) or **EAS Build** for the cloud.

### Feed: quizzes and milestones

After about **every 8 reel swipes**, the app may open **PostReelDrillModal** (cloze / pick / shadow-style practice) with accent colors from `constants/designTokens.ts`. **MilestoneOverlay** celebrates streak and points thresholds using data from `lib/progressMetrics.ts`. Root layout loads **Inter** + **Space Mono** via `@expo-google-fonts/*` (`app/_layout.tsx`).

---

## macOS — iPhone Simulator (Xcode / Simulator.app)

**Requirements:** [Xcode](https://developer.apple.com/xcode/) from the Mac App Store (includes **Simulator**). Accept licenses and install an iOS runtime once via Xcode → Settings → Platforms.

```bash
cd Lingua
npm install
npm run ios
```

Or start the dev server and choose iOS when prompted:

```bash
npm run dev
# press i  → open iOS Simulator
```

**Optional — full Xcode build** (generates `ios/` and compiles native code; use when you need native modules or want to mirror CI):

```bash
npx expo prebuild --platform ios   # creates/updates ios/
npx expo run:ios                   # builds & runs in Simulator (uses Xcode under the hood)
```

Use `npm run native:ios` as a shortcut for `expo run:ios` after prebuild exists.

---

## Windows — native “phone” = Android Emulator (not Xcode)

1. **Android Studio** — install from [developer.android.com/studio](https://developer.android.com/studio). In **More Actions → SDK Manager**, install **Android SDK Platform-Tools** (includes `adb`).

2. **Phone AVD (virtual device)** — **Device Manager** (phone icon) → **Create device** → pick a **Phone** profile (e.g. **Pixel 9** / **Pixel 8**), not a tablet → finish the wizard → **▶ Run** the AVD so a phone window is open.

3. **Run Lingua inside that phone** — from the project root:

   ```powershell
   cd Lingua
   npm install
   npm run phone:android
   ```

   This runs `expo start --android` after a quick **`adb devices`** hint if nothing is online. Same as **`npm run android`** with clearer messaging. The app fills the **emulator window** — that is the Expo-recommended Windows substitute for the **iOS Simulator**.

4. **Web (fast iteration, not native)** — React Native Web in the browser; wide layouts use **`WebDeviceShell`** (~393px column). Optional decorative frame: **`npm run web`** then **`npm run preview:iphone-web`** (`/iphone-simulator.html`).

5. **Real iPhone** — **Expo Go** + `npm run dev` (or **`npm run dev:tunnel`** if LAN fails).

6. **Cloud iOS** — **`npm run build:ios`** / [EAS Build](https://docs.expo.dev/build/introduction/) when you need an **IPA** without a Mac on your desk every day.

---

## Scripts reference

| Script | Purpose |
|--------|---------|
| `npm run dev` / `npm start` | Interactive Metro; press `w` / `i` / `a` |
| `npm run web` | Web only |
| `npm run ios` | **Mac:** open **iOS Simulator** |
| `npm run android` | Android emulator / device (`expo start --android`) |
| `npm run phone:android` | Same as above + **`adb`** / AVD hints (preferred on Windows) |
| `npm run dev:tunnel` | Tunnel for phones when LAN fails |
| `npm run preview:iphone-web` | Opens **`/iphone-simulator.html`** (device frame); use after `npm run web` |
| `npm run ios:prebuild` | Generate **`ios/`** for Xcode (`expo prebuild --platform ios`) |
| `npm run ios:xcode` | Prebuild + **`expo run:ios`** (builds with Xcode / opens Simulator) |
| `npm run native:ios` | `expo run:ios` — Xcode build path after prebuild |
| `npm run native:android` | `expo run:android` |
| `npm run prebuild` | Generate `ios/` + `android/` native projects |

---

## VS Code

Install the recommended **Expo Tools** extension (see `.vscode/extensions.json`).

Use **Terminal → Run Task…** for:

- **Expo: start (interactive)** — pick platform in terminal  
- **Expo: Web** — browser + `WebDeviceShell` phone column on wide screens  
- **Expo: Android emulator (native phone)** — start a **phone** AVD first (Android Studio)  
- **Expo: open iPhone web frame** — optional decorative iframe page (start **Expo: Web** first)  
- **Expo: iOS Simulator** — macOS + Xcode only (stub message on Windows)

---

## Troubleshooting

- **White screen on web:** `npx expo start --clear --web`
- **`npm run ios` on Windows:** Expected to fail; use `npm run web`, Android, or a physical device.
- **Simulator doesn’t open:** Xcode installed? `xcode-select --install`; open Xcode once.
