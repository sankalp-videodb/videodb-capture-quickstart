# Node.js Capture Quickstart

A complete example showing real-time media capture, indexing, and transcription using the VideoDB Node.js SDK.

## Overview

This app demonstrates the full VideoDB Capture workflow in a single script:
- Creates a capture session with WebSocket for real-time events
- Captures screen and audio using the native capture client
- Performs live transcription and visual indexing
- Detects and alerts on specific applications (IDEs, terminals, browsers)

## Prerequisites

1. **Node.js 18+**
2. **VideoDB API Key**: Get one from [console.videodb.io](https://console.videodb.io)

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and add your API key:
   ```bash
   cp .env.example .env
   # Edit .env and set VIDEODB_API_KEY
   ```

## Running the App

Start the application:

```bash
npm start
```

The app will:
1. Connect to VideoDB and create a capture session
2. Request permissions for microphone and screen capture
3. Start recording audio and video
4. Display real-time transcripts and visual indexing events

**Press Ctrl+C to stop.**

## What's Happening?

1. **Session Creation** — The script creates a capture session and generates a client token for authentication
2. **Capture Initialization** — The native capture client requests permissions and discovers available channels (mic, display, system audio)
3. **Recording Start** — Selected channels begin streaming media to VideoDB
4. **AI Pipelines** — Once active, transcription and visual indexing start automatically
5. **Real-time Events** — Transcripts and scene descriptions stream back via WebSocket
6. **Alert Detection** (if `WEBHOOK_URL` is set) — Detects IDEs, terminals, and browsers, sending webhook notifications

## Expected Output

You'll see output like this:

```
╔════════════════════════════════════════════════════════════╗
║   VideoDB CaptureSession Live Demo                         ║
║   Press Ctrl+C to stop                                     ║
╚════════════════════════════════════════════════════════════╝

[12:34:56] ℹ Connecting to VideoDB...
[12:34:57] ✓ Connected as user: u-xxx
[12:34:57] ✓ Using collection: c-xxx
[12:34:57] ℹ Connecting WebSocket for real-time events...
[12:34:58] ✓ WebSocket connected: ws_connection_id
[12:34:58] ℹ Creating capture session...
[12:34:59] ✓ Capture session created: cap-xxx
[12:34:59] ✓ Client token generated (1 hour expiry)
[12:34:59] ℹ Initializing CaptureClient...
[12:34:59] ℹ Requesting permissions...
[12:35:00] ✓ Microphone permission: granted
[12:35:01] ✓ Screen capture permission: granted
[12:35:01] ℹ Listing available channels...

  Available channels:
    • mic:default (audio): Default Microphone
    • display:1 (video): Built-in Display

[12:35:01] ℹ Starting capture with channels: mic:default, display:1
[12:35:02] ✓ Capture session started!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 Streaming real-time events (Ctrl+C to stop)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[WEBSOCKETSTREAM:12:35:05] [TRANSCRIPT] 📝 "Hello, this is a test recording"
[WEBSOCKETSTREAM:12:35:08] [SCENE_INDEX] 💻 VSCode - User is editing code in index.ts
[WEBSOCKETSTREAM:12:35:11] [SPOKEN_INDEX] 💬 User is discussing implementation details
[WEBSOCKETSTREAM:12:35:14] [ALERT] 💻 IDE Detected: VSCode visible on screen
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VIDEODB_API_KEY` | ✅ Yes | Your VideoDB API key from console.videodb.io |
| `VIDEODB_COLLECTION_ID` | No | Collection ID (defaults to `default`) |
| `WEBHOOK_URL` | No | Webhook endpoint for alert notifications. If not set, alerts are disabled |

## Troubleshooting

### API Key Issues
- **Error: `VIDEODB_API_KEY is required`**
  - Make sure you've created a `.env` file with your API key
  - Verify the API key is valid at [console.videodb.io](https://console.videodb.io)

### Permission Errors
- **Error: Permission request failed**
  - Grant system permissions for microphone and screen recording when prompted
  - On macOS: Check System Preferences → Security & Privacy → Privacy
  - On Windows: Check Settings → Privacy → Camera/Microphone

### No Channels Available
- **Warning: No channels available - running in WebSocket-only mode**
  - The native capture binary may not be running properly
  - Try reinstalling: `npm install`
  - Check that your system supports the capture binary (macOS 10.15+, Windows 10+)

### No AI Results Appearing
- Make sure you're generating audio or visual activity to be indexed
- Verify the capture session status shows as "active"
- Check that the WebSocket connection was established successfully

## Stopping the Recording

When you press **Ctrl+C**:

1. The app initiates graceful shutdown
2. It stops the capture session on the server
3. The native binary is shut down
4. The WebSocket connection is closed

Wait a few seconds for the session to finalize. Once stopped, you can view the exported video in the VideoDB console.

## What Gets Captured?

- **Audio**: Microphone input (speech, ambient sound)
- **Video**: Screen content (applications, websites, desktop activity)
- **Transcripts**: Real-time speech-to-text from audio
- **Visual Index**: Descriptions of what's visible on screen (every 3 seconds)
- **Audio Index**: Summaries of spoken content (every 15 words)
- **Alerts**: Detections of specific applications (if webhook is configured)
