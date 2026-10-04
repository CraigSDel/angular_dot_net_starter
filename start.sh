#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$ROOT_DIR/ClientApp"
APP_URL="${APP_URL:-http://127.0.0.1:5000}"

if ! command -v dotnet >/dev/null 2>&1; then
  echo "dotnet is required. Install the .NET 10 SDK and try again." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install Node.js 26 and try again." >&2
  exit 1
fi

if [[ ! -d "$CLIENT_DIR/node_modules" ]]; then
  echo "Installing frontend dependencies..."
  npm ci --prefix "$CLIENT_DIR"
fi

export ASPNETCORE_ENVIRONMENT="${ASPNETCORE_ENVIRONMENT:-Development}"
export NG_CLI_ANALYTICS="false"
STARTUP_TIMEOUT_SECONDS="${STARTUP_TIMEOUT_SECONDS:-120}"
CLIENT_PORT="${CLIENT_PORT:-4200}"
SPA_URL="${SPA_URL:-http://127.0.0.1:${CLIENT_PORT}}"
export SPA_URL

echo "Starting User Task Management at $APP_URL"
npm --prefix "$CLIENT_DIR" start -- --host 127.0.0.1 --port "$CLIENT_PORT" &
CLIENT_PID=$!

dotnet run \
  --project "$ROOT_DIR/user-task-management.csproj" \
  --no-launch-profile \
  --urls "$APP_URL" &
APP_PID=$!

forward_signal() {
  kill -TERM "$APP_PID" 2>/dev/null || true
  kill -TERM "$CLIENT_PID" 2>/dev/null || true
}

cleanup() {
  if kill -0 "$APP_PID" 2>/dev/null; then
    kill -TERM "$APP_PID" 2>/dev/null || true
  fi
  if kill -0 "$CLIENT_PID" 2>/dev/null; then
    kill -TERM "$CLIENT_PID" 2>/dev/null || true
  fi
}

trap forward_signal INT TERM
trap cleanup EXIT

deadline=$((SECONDS + STARTUP_TIMEOUT_SECONDS))
while (( SECONDS < deadline )); do
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    if wait "$APP_PID"; then
      status=0
    else
      status=$?
    fi
    echo "User Task Management stopped before startup completed (exit code $status)." >&2
    exit "$status"
  fi

  if ! kill -0 "$CLIENT_PID" 2>/dev/null; then
    if wait "$CLIENT_PID"; then
      status=0
    else
      status=$?
    fi
    echo "Angular stopped before startup completed (exit code $status)." >&2
    exit "$status"
  fi

  if curl --fail --silent --show-error --max-time 2 --output /dev/null "$APP_URL/health" 2>/dev/null \
    && curl --fail --silent --show-error --max-time 2 --output /dev/null "$SPA_URL/" 2>/dev/null; then
    echo "Application ready at $APP_URL"
    if wait "$APP_PID"; then
      exit 0
    else
      exit $?
    fi
  fi

  sleep 1
done

echo "Timed out after ${STARTUP_TIMEOUT_SECONDS}s waiting for $APP_URL/health to respond." >&2
exit 1
