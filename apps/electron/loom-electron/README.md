# Async Recorder

A modern, Loom-like Electron application demonstrating how to integrate the **VideoDB Recorder SDK** for seamless screen and camera recording.

## Features

- **Loom-like Recording**: Capture both your screen and a circular camera bubble in a single session.
- **Camera Bubble**: A draggable, always-on-top circular camera view that stays visible while you record.
- **Smart Status**: Real-time status indicators ("Starting...", "Recording", "Ready") to keep you informed.
- **Separate History Window**: Dedicated, resizeable window to browse, watch, and review your past recordings.
- **Meeting Insights**: Automatically indexes recordings for searchability using VideoDB's semantic index.
- **In-App Playback**: Watch recordings instantly with a built-in HLS video player.
- **Meeting Detection**: Automatic detection of Google Meet (Chrome, Safari) and Zoom App with notification prompts to start recording.
- **Zero-Config Tunneling**: Uses Cloudflare Quick Tunnels for webhook callbacks - no signup or tokens required.

## Architecture

This Async Recorder app uses a **Hybrid Architecture**:

1.  **Electron Frontend (Client)**:
    - **Main Process**: Manages the application lifecycle, including the main recorder window and the separate camera bubble overlay.
    - **Renderer Process**: Handles the UI, interacts with the Recorder SDK, and manages recording state.
    - **Camera Bubble**: A separate, transparent `BrowserWindow` (`camera.html`) that displays the webcam stream. It is lazy-loaded and synced with the main recorder's controls.
    - **History Window**: A separate `BrowserWindow` (`history.html`) for browsing and viewing past recordings.

2.  **FastAPI Backend (Server)**:
    - Runs locally in `server/`.
    - Securely stores the VideoDB API Key in a local SQLite database (`users.db`).
    - Exposes endpoints for User Registration (`/api/register`) and Session Token generation (`/api/token`).
    - **Cloudflare Tunneling**: Uses Cloudflare Quick Tunnels (trycloudflare.com) for zero-config public webhook URLs.

**Communication Flow**:
1.  **Startup**: `scripts/start-server.sh` starts the Python backend. The backend writes its address and webhook URL to `runtime.json`.
2.  **Discovery**: The Electron app reads `runtime.json` to know where to send API requests.
3.  **Authentication**: When you "Connect", the frontend calls the backend to exchange your API Key for a secure session token.
4.  **Recording**: The frontend uses the token and webhook URL to initialize the Recorder SDK.
5.  **Webhook**: When recording completes, VideoDB sends a `capture_session.exported` event to the Cloudflare tunnel URL.

## Prerequisites

- **Node.js**: v16 or higher.
- **API Key**: A valid VideoDB API key.
- **macOS**: Optimized for macOS permissions and window management.
- **cloudflared**: Cloudflare tunnel binary (auto-detected from PATH or Homebrew).

> **Note**: Python 3.12 is automatically installed via [`uv`](https://github.com/astral-sh/uv) on first run. No manual Python setup is required.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd apps/electron/loom-electron
    ```

2.  **Run setup** (one-time):
    ```bash
    npm run setup
    ```
    This will prompt for your VideoDB API key and install dependencies.

3.  **Start the app:**
    ```bash
    npm start
    ```

## Configuration

### Quick Start (No Configuration Needed!)

For basic local usage, **no `.env` file is required**. Simply run `npm run setup` to enter your API key, then `npm start`.

### Optional: Environment Variables

If you want to customize settings, create a `.env` file:

| Variable | Description |
|----------|-------------|
| `API_PORT` | Port for local backend (default: `8000`) |
| `VIDEODB_API_URL` | Custom VideoDB API URL (for dev/staging) |

## Running the App

Start the application:

```bash
npm start
```

This command executes `scripts/start-server.sh`, which automatically:
1.  Sets up a Python virtual environment.
2.  Installs [`uv`](https://github.com/astral-sh/uv) (a fast Python package installer) if not already installed.
3.  Installs Python dependencies including the VideoDB SDK.
4.  Starts the local FastAPI backend with Cloudflare tunnel.
5.  Writes `runtime.json` with the webhook URL.
6.  Launches the Electron application.

## Usage Guide

1.  **Connect Profile**:
    - Enter your **Name** and **VideoDB API Key** (if not done during setup).
    - Click **Connect & Start**.
    - Your API Key is securely stored locally (`users.db`).

2.  **Prepare to Record**:
    - Use the **Source Controls** to toggle your Microphone, System Audio, and the **Camera Bubble**.
    - The Camera Bubble will appear in the bottom-right corner of your screen. Drag it to your preferred position.

3.  **Start Recording**:
    - Click **"Start Recording"**.
    - The status will change to "Recording".

4.  **Stop & Review**:
    - Click **"Stop Recording"**.
    - Click the **History** button (clock icon) to open the History Window and view your recordings.

## Project Structure

- `server/`: Python FastAPI backend.
- `main.js`: Electron main process. Manages windows (Main, Camera, History).
- `index.html` & `renderer.js`: Main recorder UI and logic.
- `camera.html` & `camera.js`: Transparent camera bubble implementation.
- `history.html` & `history.js`: Dedicated history window implementation.
- `src/ui/`: Modular UI/logic components (`sidebar.js`, `permissions.js`).
- `scripts/`: Setup and startup scripts.

## Deployment

To deploy for production:

1.  **Deploy the Server**: Host the Python app (`server/`) on a cloud provider (AWS, GCP, Heroku).
2.  **Configure Client**:
    - Create a `runtime.json` file in the root resources with your production backend URL:
      ```json
      {
        "api_url": "https://your-backend.com",
        "webhook_url": "https://your-backend.com/api/webhook"
      }
      ```

## Troubleshooting

### Python Issues

- **Python version errors**: The app uses `uv` to automatically install Python 3.12. If you see errors, ensure internet access on first run.
- **Package installation fails**: Delete `server/venv` and run `npm start` again.

### Tunnel Issues

- **Cloudflare tunnel not starting**: Ensure `cloudflared` is installed (`brew install cloudflared` on macOS).
- **Webhook not received**: Check the terminal output for the tunnel URL. Ensure it matches what's in `runtime.json`.

### Permissions (macOS)

- **Permissions Denied**: Go to **System Settings > Privacy & Security** and enable Screen Recording/Microphone/Camera.
- **Camera Not Showing**: Toggle Camera switch off and on. Ensure the app has Camera permission in System Settings.
- **History Empty**: Ensure backend server is running and connected.

### Reset Everything

If you encounter issues, try a clean restart:

```bash
rm -rf server/venv
rm -f server/recordings.db
rm -f runtime.json
npm run setup
npm start
```
