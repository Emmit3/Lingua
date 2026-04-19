"""
LAN-accessible Flask dev server — open the app from your phone on the same Wi‑Fi.

Setup (once):
  python -m venv .venv
  .venv\\Scripts\\activate          # Windows
  pip install flask

Run:
  python lan_dev_server.py

Then on your phone’s browser, open:
  http://<YOUR_PC_LAN_IP>:5000/

The script prints your LAN IP on startup. On Windows you can also run: ipconfig

Security / best practices (read this):
  - Binding to 0.0.0.0 exposes the server to your LAN. Do not run this on untrusted
    networks, and do not put secrets or production data on this process.
  - Keep DEBUG off when listening on all interfaces — the Werkzeug debugger allows
    remote code execution if enabled and reachable.
  - Allow Python (or the chosen port) through Windows Defender Firewall when prompted,
    or add an inbound rule for TCP port 5000 (or whatever FLASK_PORT you use).
  - For production on the public internet, use a real WSGI server (e.g. gunicorn,
    waitress) behind HTTPS and a reverse proxy — not this script.

Env (optional):
  FLASK_HOST   default 0.0.0.0
  FLASK_PORT   default 5000
"""

from __future__ import annotations

import os
import socket
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template_string

INDEX_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lingua LAN dev</title>
  <style>
    :root { font-family: system-ui, sans-serif; line-height: 1.5; }
    body { margin: 2rem; max-width: 40rem; }
    code { background: #f4f4f5; padding: 0.15rem 0.35rem; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>LAN server is up</h1>
  <p>You reached this page from another device on the network.</p>
  <p>Health JSON: <a href="/api/health"><code>/api/health</code></a></p>
  <p><small>Server time (UTC): {{ server_time }}</small></p>
</body>
</html>
"""


def _guess_lan_ipv4() -> str:
    """Best-effort local IPv4 for display (not used for binding)."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("10.255.255.255", 1))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def create_app() -> Flask:
    app = Flask(__name__)
    # Do not enable debug when host is 0.0.0.0 — unsafe on a shared LAN.
    app.config["DEBUG"] = False

    @app.get("/")
    def index():
        return render_template_string(
            INDEX_HTML,
            server_time=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        )

    @app.get("/api/health")
    def health():
        return jsonify(
            ok=True,
            service="lan_dev_server",
            time_utc=datetime.now(timezone.utc).isoformat(),
        )

    return app


app = create_app()


if __name__ == "__main__":
    host = os.environ.get("FLASK_HOST", "0.0.0.0")
    port = int(os.environ.get("FLASK_PORT", "5000"))
    lan = _guess_lan_ipv4()

    print(f"Listening on http://{host}:{port}/  (all interfaces)")
    print(f"From your phone, try: http://{lan}:{port}/")
    print("Press Ctrl+C to stop.\n")

    # threaded=True helps a tiny bit if two devices hit the dev server at once.
    app.run(host=host, port=port, debug=False, threaded=True, use_reloader=False)
