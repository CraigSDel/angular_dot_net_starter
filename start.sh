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

echo "Starting User Task Management at $APP_URL"
exec dotnet run \
  --project "$ROOT_DIR/user-task-management.csproj" \
  --no-launch-profile \
  --urls "$APP_URL"
