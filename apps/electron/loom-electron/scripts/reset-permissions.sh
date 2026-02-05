#!/bin/bash
set -euo pipefail

APP_IDENTIFIER="com.videodb.async-recorder"
APP_PATH="/Applications/Async Recorder.app"

if ! command -v tccutil >/dev/null 2>&1; then
  echo "tccutil not available on this system" >&2
  exit 1
fi

echo "Resetting Screen Recording permission for ${APP_IDENTIFIER}" \
  "(path: ${APP_PATH})"
sudo tccutil reset ScreenCapture "${APP_IDENTIFIER}"

echo "Resetting Microphone permission for ${APP_IDENTIFIER}"
sudo tccutil reset Microphone "${APP_IDENTIFIER}"

echo "Done. Relaunch Async Recorder and re-grant permissions if prompted."
