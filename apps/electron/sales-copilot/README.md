# VideoDB Recorder - Meeting Copilot

A sample Electron application demonstrating how to integrate the **VideoDB Recorder SDK** for building a meeting copilot with screen recording and real-time transcription.

## Features

- **Screen & Audio Recording**: Captures system audio/video and microphone input.
- **Real-time Preview**: Low-latency video preview (< 500ms) using `rtsp-relay` and canvas rendering.
- **Real-time Transcription**: Displays live transcription segments from the Recorder SDK.
- **Meeting Insights**: Automatically indexes recordings for searchability, ensuring your meeting data is queryable.
- **Meeting Detection**: Automatic detection of Google Meet (Chrome, Safari) and Zoom App with notification prompts to start recording.
- **Recording Lifecycle**: Full state tracking (Recording -> Processing -> Available) with visual status badges.
- **Session History**: Dedicated full-screen history view with grouped lists and detailed metadata.
- **Configuration UI**: Configure API endpoints and callback URLs directly from the app; syncs state with backend.
- **Auto-Authentication**: Validates session tokens on startup to prevent stale access states.
- **Deployment Ready**: Instructions provided for separating backend and frontend deployments.
- **Permission Handling**: Built-in flow for checking and requesting system permissions (macOS).

## Architecture

This Meeting Copilot app uses a **Hybrid Architecture**:

1.  **Electron Frontend (Client)**:
    - Handles UI, Screen Recording, and Audio Capture.
    - Uses the `@videodb/recorder` SDK to stream media.
    - **Live Preview**: Uses `rtsp-relay` to proxy RTSP streams over WebSockets for low-latency playback in a canvas.
    - Reads `runtime.json` on startup to discover the backend URL.

2.  **FastAPI Backend (Server)**:
    - Runs locally in `server/`.
    - Securely stores the VideoDB API Key in a local SQLite database (`users.db`).
    - Exposes endpoints for User Registration (`/api/register`) and Session Token generation (`/api/token`).
    - Exposes endpoints for User Registration (`/api/register`) and Session Token generation (`/api/token`).
    - **Ngrok Tunneling**: Uses Ngrok for reliable public webhook URLs with one-time authentication setup.

**Communication Flow**:
1.  **Startup**: `scripts/start-server.sh` starts the Python backend. The backend writes its address (e.g., `http://localhost:8000`) to `runtime.json` in the project root.
2.  **Discovery**: The Electron app reads `runtime.json` to know where to send API requests.
3.  **Authentication**: When you "Connect", the frontend calls the backend to exchange your API Key for a secure session token.
4.  **Session**: The frontend uses this token to initialize the Recorder SDK.

## Prerequisites

- **Node.js**: v16 or higher.
- **API Key**: You need a valid VideoDB API key.
- **macOS**: Currently, screen recording permissions and flows are optimized for macOS.

> **Note**: Python 3.12 is automatically installed via [`uv`](https://github.com/astral-sh/uv) on first run. No manual Python# Meeting Copilot

This is an Electron-based application that demonstrates the capabilities of the [VideoDB Recorder SDK](https://github.com/video-db/recorder). It serves as a comprehensive example of:

-   **Screen Recording**: Capturing the screen using the SDK.
-   **Audio Capture**: Recording microphone audio.
-   **Meeting Detection**: Using the sidecar binary to detect meeting status.
-   **Python Backend**: Using a local FastAPI server for handling recordings.
-   **Ngrok Tunneling**: Exposing the local server for callbacks.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    # This also installs Python dependencies (FastAPI, uvicorn, etc.)
    ```

2.  **Configuration**:
    -   The app uses `config.json` in `Application Support` for persistent auth.
    -   Reads `runtime.json` on startup to discover the backend URL. Simply run `npm start` and the app will prompt you for your VideoDB API Key.

### Optional: Environment Variables

If you want to customize settings or disable the public tunnel, copy the example file:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `API_PORT` | Port for local backend (default: `8000`) |
| `USE_TUNNEL` | Enable/disable public tunnel (default: `true`) |

> **Note**: Your VideoDB API Key is entered in the app UI at startup, not in `.env`. This keeps your key secure in a local database rather than a plain text file.

## Running the App

Start the application in development mode:

```bash
npm start
```

This command executes `scripts/start-server.sh`, which automatically:
1.  Creates a Python virtual environment in `server/venv` (if missing).
2.  Installs [`uv`](https://github.com/astral-sh/uv) (a fast Python package installer) if not already installed.
3.  Installs necessary Python dependencies using `uv`.
4.  Starts the local FastAPI backend on port `8000` (or next available).
5.  Launches the Electron application.

> **Note**: The local server writes a `runtime.json` file to the project root, which the Electron app reads to connect to the correct backend port.

## Usage Guide

1.  **Connect Profile**:
    - Enter your **Name** and **VideoDB API Key**.
    - Click **Connect & Start**.
    - The app will securely register you with the local server and store an access token.
    - **Note**: Your API Key is stored only on the local backend database (`users.db`), never in the frontend.

2.  **Start Session**:
    - Click **"Start Session"**.
    - The app will initialize the Recorder SDK and start recording.

3.  **Recording & Transcription**:
    - The "Activity Logs" panel will show connection status.
    - Valid transcriptions will appear in the "Transcriptions" tab in real-time.

4.  **Stop Session**:
    - Click **"Stop Session"** to end the recording.
    - Verification: Check your Callback URL to see if the session data was posted.

5.  **View History**:
    - Click the **History** icon in the sidebar to view past sessions.
    - Browse recordings in the left list and watch playback/insights in the right pane.

## Project Structure

- `server/`: Python FastAPI backend. Handles authentication, token generation, and database interactions.
- `scripts/`: Shell scripts for starting the server (`start-server.sh`) and maintenance.
- `frontend/`: Electron frontend source (moved from root).
- `frontend/main.js`: Electron main process. Orchestrates the app lifecycle and communicates with the local backend.
- `frontend/renderer.js`: Electron renderer process (Frontend). Orchestrates the UI.
- `frontend/src/ui/`: Modular UI components (`auth-modal.js`, `wizard.js`, `transcription.js`).
- `frontend/src/utils/`: Shared utilities (`permissions.js`, `logger.js`).

## Deployment

You can deploy the backend server to your own infrastructure (e.g., AWS, GCP, Heroku) instead of running it locally.

1.  **Deploy the Server**:
    - Build and deploy the Python app located in `server/`.
    - Ensure it is accessible via HTTPS.

2.  **Configure the Electron App**:
    - Create a `runtime.json` file in the root of the Electron app (or update your build process to generate it) with your production URL:
      ```json
      {
        "api_url": "https://your-backend-service.com",
        "webhook_url": "https://your-backend-service.com/api/webhook"
      }
      ```
    - Alternatively, modify `main.js` to look for environment variables or a hardcoded URL for production builds.

## Troubleshooting

### Python Issues

- **Python version errors**: The app uses `uv` to automatically install Python 3.12. If you see version-related errors, ensure you have internet access for the first run.
- **Package installation fails**: Try deleting `server/venv` and running `npm start` again to recreate the virtual environment.

### Tunnel Issues

### Tunnel Issues

- **Ngrok Auth Required**: The app uses [ngrok](https://ngrok.com) for secure tunneling. On the first run, you will be prompted to enter your **Ngrok Authtoken**.
  - Get your token for free at **[dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)**.
  - The app saves this token for future sessions.
- **Tunnel Error**: If the tunnel fails to start, check the "Activity Logs" in the app or the terminal output for error details.

### Permissions (macOS)

- **Permissions Denied**: Go to **System Settings > Privacy & Security > Screen Recording** (or Microphone) and enable the app. Restart after changing permissions.
- **Notifications Not Showing**: Go to **System Settings > Notifications > Electron** and ensure "Allow Notifications" is ON.

## FAQ

### How are insights generated?
The app uses **VideoDB's `generate_text()` SDK method** to analyze the meeting transcript. It generates a comprehensive **Markdown Report** containing an executive summary, key discussion points, action items, and decisions. This happens automatically after the video is indexed.

### Where is my data stored?
- **Video & Audio**: Streamed and stored securely in your VideoDB collection.
- **User Keys**: Stored locally in a SQLite database (`users.db`) on your machine.
- **Application Logs**: Stored locally in the `logs/` directory.

### Why do I see "Video playback not supported"?
The app uses HLS streaming. If you see this message, ensure you are connected to the internet, as the video is streamed directly from VideoDB's servers.

