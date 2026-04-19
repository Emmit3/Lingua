/**
 * Windows / Linux / Mac: start Expo targeting the Android emulator — the usual
 * substitute for "Xcode + iOS Simulator" when you are not on macOS.
 *
 * Prereqs: Android Studio installed, one **phone** AVD created (Device Manager → Pixel …),
 * and `adb` on PATH (Studio often adds `…\Android\Sdk\platform-tools`).
 *
 * Usage: npm run phone:android
 */

import { spawn } from 'node:child_process';
import process from 'node:process';

function tryAdbDevices() {
  return new Promise((resolve) => {
    const p = spawn('adb', ['devices'], { shell: true, windowsHide: true });
    let out = '';
    p.stdout?.on('data', (d) => {
      out += String(d);
    });
    p.stderr?.on('data', (d) => {
      out += String(d);
    });
    p.on('error', () => resolve(null));
    p.on('close', () => resolve(out));
  });
}

async function main() {
  const adbOut = await tryAdbDevices();
  if (adbOut == null) {
    console.warn(
      '[phone:android] `adb` not found. Add Android SDK `platform-tools` to your PATH, or open Android Studio → Device Manager and start an AVD, then retry.\n',
    );
  } else {
    const devices = adbOut
      .split('\n')
      .filter((line) => /\t(device|emulator)/.test(line));
    if (devices.length === 0) {
      console.warn(
        '[phone:android] No device/emulator online. Start a **phone** AVD in Android Studio (Tools → Device Manager), then run this script again.\n',
      );
    } else {
      console.log('[phone:android] adb sees', devices.length, 'device(s). Starting Metro + Android…\n');
    }
  }

  const child = spawn('npx', ['expo', 'start', '--android'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  });
  child.on('exit', (code) => process.exit(code ?? 0));
}

main();
