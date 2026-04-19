/**
 * Opens the **iPhone device-frame** preview page (`public/iphone-simulator.html`) in the system browser.
 * Start the app first: `npm run web` — then run `npm run preview:iphone-web`.
 *
 * - **Web frame:** served from the same Expo web origin (e.g. `http://localhost:8081/iphone-simulator.html`).
 * - **Native Simulator (Xcode):** macOS only — `npm run ios` or `npm run native:ios`. See **DEVELOPMENT.md**.
 *
 * Override app origin (e.g. different Metro port):
 *   set LINGUA_WEB_URL=http://localhost:19006 && npm run preview:iphone-web   (Windows cmd)
 *   $env:LINGUA_WEB_URL='http://localhost:19006'; npm run preview:iphone-web   (PowerShell)
 *
 * Open only the raw app (no chrome): set LINGUA_WEB_PREVIEW=root
 */

const { spawn } = require('child_process');
const os = require('os');

const base = (
  process.env.LINGUA_WEB_URL ||
  process.env.EXPO_PUBLIC_WEB_URL ||
  'http://localhost:8081'
).replace(/\/$/, '');

const url =
  process.env.LINGUA_WEB_PREVIEW === 'root'
    ? `${base}/`
    : `${base}/iphone-simulator.html`;

const platform = os.platform();

function openUrl(target) {
  if (platform === 'darwin') {
    spawn('open', [target], { stdio: 'inherit', shell: false });
  } else if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', target], { stdio: 'inherit', shell: false });
  } else {
    spawn('xdg-open', [target], { stdio: 'inherit', shell: false });
  }
}

console.log('[preview:iphone-web] Opening', url);
if (!process.env.LINGUA_WEB_PREVIEW) {
  console.log('[preview:iphone-web] Tip: edit “App origin” on the page if Metro uses another host/port.');
}
openUrl(url);
