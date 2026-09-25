#!/usr/bin/env bash
set -e

PORT=8000
LOG=/tmp/rmo-site-preview.log
PID=/tmp/rmo-site-preview.pid

# Stop only an older copy of this preview server, if one exists.
if [ -f "$PID" ]; then
  OLD_PID="$(cat "$PID" 2>/dev/null || true)"
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    kill "$OLD_PID" 2>/dev/null || true
    sleep 1
  fi
fi

# Start from the repository root and detach the server from the lifecycle shell.
cd "${CODESPACE_VSCODE_FOLDER:-$(pwd)}"
setsid python3 -m http.server "$PORT" --bind 0.0.0.0 >"$LOG" 2>&1 < /dev/null &
SERVER_PID=$!
echo "$SERVER_PID" > "$PID"

# Give it a moment to bind, then fail loudly if it did not start.
sleep 1
if ! kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "Preview server failed to start. Log:"
  cat "$LOG"
  exit 1
fi

echo "Website preview running on port $PORT (PID $SERVER_PID)"
