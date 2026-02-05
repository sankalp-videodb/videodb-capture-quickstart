# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-02-05

### Changed
- **Zero-Config Tunneling**: Replaced ngrok with Cloudflare Quick Tunnels (pycloudflared).
  - No signup, tokens, or authentication required - just works out of the box.
  - Tunnel URL is automatically generated on server startup.
- **VideoDB SDK**: Updated to use VideoDB SDK 0.4.1 from TestPyPI.
- **Webhook Handler**: Simplified to only handle `capture_session.exported` event.
- **Camera Permission**: Added proper camera permission request flow on macOS.

### Added
- **Setup Script**: Added `npm run setup` for one-time API key configuration.
- **Camera Permission Handling**: App now requests camera permission before showing camera bubble.

### Removed
- **Ngrok Dependencies**: Removed `pyngrok` from backend, ngrok modal from frontend.
- **Tunnel Rotation**: Removed `/api/tunnel/rotate` endpoint (Cloudflare tunnels are stable).
- **Legacy Webhook Formats**: Removed support for old webhook event formats.

### Fixed
- **VIDEODB_API_URL Sync**: Aligned environment variable usage between frontend and backend.

## [1.4.8] - 2026-01-06

### Changed
- **Loom-Style Subtitles**: Enhanced video indexing to generate specific subtitle styling.
- **Robust Tunnel Recovery**: Added auto-recovery for "tunnel already online" errors to prevent startup failures.
- **Flexible Port Config**: Backend now attempts to load `API_PORT` from `.env` file first before falling back to default or scanning.
- **Modern Config**: Migrated settings to Pydantic v2 `SettingsConfigDict`.

## [1.4.7] - 2026-01-06

### Changed
- **Unified Ngrok Status Check**: Synced ngrok auth flow across all apps. Uses `/api/tunnel/status` endpoint to check if ngrok is working instead of pyngrok config check.
- **Improved First-Run Experience**: Modal now correctly detects configured ngrok based on working webhook URL.

### Fixed
- **Ngrok Modal Not Dismissing**: Fixed issue where the ngrok modal would still appear even after successful configuration.

## [1.4.6] - 2026-01-06

### Fixed
- **Ngrok Auth Modal on First Run**: Fixed an issue where the Ngrok authentication modal would not appear on first-time startup when ngrok was not configured. The app now proactively checks tunnel status and displays the auth modal immediately instead of requiring users to click "Start Recording" first.

### Added
- **Tunnel Status API**: Added `/api/tunnel/status` endpoint to check ngrok auth status.
- **Proactive Auth Check**: App now checks and displays ngrok auth modal during initialization.

## [1.4.5] - 2026-01-03

### Changed
- **Tunneling**: Replaced `localtunnel` with `ngrok` for public webhook URLs.
    - Implemented `TunnelManager` for robust per-session tunnel rotation.
    - Added a built-in modal for users to securely enter and save their Ngrok Authtoken.
    - Removed `localtunnel` dependency and usage.
- **SDK Migration**: Migrated from `@videodb/relay` to `@videodb/recorder`.
- **Application Name**: Renamed to "Async Recorder".
- **API URLs**: Updated backend endpoints from `/relay/` to `/recorder/`.
- **IPC Channels**: Renamed all internal IPC channels from `relay-*` to `recorder-*`.
- **Codebase**: Replaced all remaining "Relay" references with "Recorder" in code and comments.

## [1.4.4] - 2025-12-24

### Added
- **History UI Revamp**: Thoroughly cleaned up the history page with a new header, video title display, and a dedicated "Share" button.
- **Transcript Integration**: Replaced "Insights" tab with a "Transcript" tab displaying full recording text.
- **Backend Improvements**: Backend now automatically fetches and stores transcripts from VideoDB after indexing.
- **Toast Notifications**: Added visual feedback for user actions like copying links.
- **History Grouping**: Recordings are now grouped by date (Today, Yesterday, etc.) for better organization.
- **Smart Limits**: History list defaults to showing the 20 most recent recordings to improve performance.
- **Improved Navigation**: Added a "Back" button to the history window and polished the header alignment.

### Fixed
- **Horizontal Scroll**: Fixed an issue where the main window had a persistent horizontal scroll bar by enforcing `box-sizing: border-box` and adjusting button margins.

### Changed
- **Window Constraints**: Enforced minimum and maximum dimensions for the main window (Min: 350x600, Max: 500x800).
- **Code Cleanup**: Removed unused logs panel code, transcription UI elements, and legacy configuration handlers.

## [1.4.3] - 2025-12-24

### Changed
- **Improved Startup Synchronization**: The startup script (`start-server.sh`) now explicitly waits for the Python backend to initialize and update `runtime.json` before launching the Electron app. This prevents race conditions where the app might start before the server is ready.

## [1.4.2] - 2025-12-23

### Changed
- **Zero-Config Tunneling**: Replaced `ngrok` with `localtunnel` for public URL generation.
    - No account signup or auth token required - just works out of the box.
- **Zero Python Setup**: Python 3.12 is now automatically installed via `uv` on first run.
- **Simplified Configuration**: Streamlined `.env.example` to only essential options.
- **Improved Documentation**: Updated README with Quick Start section.

### Fixed
- **Permissions Flow Before Onboarding**: Permissions check is now strictly blocking.
- **Duplicate Event Listeners**: Fixed lifecycle issue where SDK event listeners could be registered twice.

### Removed
- Removed `pyngrok` dependency from Python requirements.
- Removed `NGROK_AUTHTOKEN` environment variable.

## [1.4.1] - 2025-12-23

### Changed
- **Faster Dependency Installation**: Switched from `pip` to [`uv`](https://github.com/astral-sh/uv) for Python dependency management.
    - `uv` is auto-installed on first run if not present.
    - Provides 10-100x faster package installation and better dependency resolution.

## [1.4.0] - 2025-12-22

### Changed
- **Rebranding**: Renamed application to **Relay Async Recorder**.
- **UI Redesign**: 
    - Moved to a **Loom-like single-column layout**.
    - Removed legacy activity logs and transcription panels for a cleaner experience.
    - Updated all terminology from "Session" to "Recording".
- **Camera Improvements**:
    - Introduced **Camera Bubble**: A draggable, circular, always-on-top window for the webcam stream.
    - **Smart Positioning**: Camera bubble defaults to the bottom-right corner.
    - **Performance**: Camera stream is now lazy-loaded to optimize app startup time.
- **History Upgrade**:
    - **Separate Window**: History view now opens in a dedicated, resizeable window.
    - Restored the classic "Clock" icon for history access.
    - Added API in `preload.js` to support multi-window management.

### Fixed
- **Responsiveness**: Fixed an issue where controls would shrink instead of filling the window width (removed legacy flex alignments).
- **Status Indicators**: Restored real-time status text ("Starting...", "Recording", "Ready") and health dot animations in the sidebar.
- **API Visibility**: Fixed missing IPC exposure for window management in the renderer process.

## [1.3.0] - 2025-12-22

### Added
- **Meeting Insights**:
    - **Video Indexing**: Recorded meetings are now automatically indexed in VideoDB for semantic search.
    - **Insights Panel**: Added a dedicated "Insights" tab in the history view to display processing status and video information.
    - **Background Processing**: Implemented background tasks to handle video indexing without blocking the UI.
- **In-App Video Player**:
    - Integrated `hls.js` for native HLS streaming directly within the application.
    - Replaced external browser playback with a seamless embedded player.

### Changed
- **Rebranding**: 
    - Renamed application to **Relay Meeting Copilot** to better reflect its purpose.
    - Updated all documentation, window titles, and artifact names.
- **History Experience Redesign**:
    - Replaced the modal-based history with a **full-screen split-pane view**.
    - **Left Pane**: Scrollable list of recorded sessions with active state indicators.
    - **Right Pane**: Persistent video player and info tabs (Insights/Chat).
    - Improved navigation between the main workspace and history view.

## [1.2.0] - 2025-12-22

### Added
- **Session History UI**: 
    - Added a new modal for viewing past recordings with a clean, premium design.
    - Integrated Material Icons for Play and Copy actions.
    - Added automatic modal switching (closing settings when opening history and vice-versa).
- **History Navigation**: Added a "History" shortcut icon to the sidebar and inside the settings menu.

### Changed
- **UI Refinement**: 
    - Simplified modal headers across the app for a cleaner look.
    - Updated Copy action feedback to provide visual cues (icon color change) without shifting the layout.
- **Backend Communication**: Updated recording history fetching to use `runtime.json` discovery, ensuring compatibility with dynamic backend ports.

### Fixed
- Fixed duplicate element ID issues that prevented the history button from working in some context.
- Fixed a bug where history would fail to load if the Python server was running on a non-default port.

## [1.1.0] - 2025-12-21

### Added
- **Local Backend Server**: 
    - Added a Python-based FastAPI backend server (`server/`) to handle authentication and session management locally.
    - Implemented automatic Python virtual environment creation and dependency installation.
    - Added `scripts/start-server.sh` to orchestrate the startup of both the Python backend and Electron frontend.
    - Integrated `ngrok` support for exposing the local server to external webhooks.
- **Frontend Integration**:
    - Implemented `runtime.json` based configuration to dynamically link the Electron frontend with the local Python backend.
    - Updated `main.js` to read runtime configuration and route API calls (registration, token fetching) to the local backend.
- **Accessibility Permissions**: 
    - Added system-level check and request flow for Accessibility permissions.
    - Added "Accessibility" item to the permission modal flow.
    - Implemented IPC handlers for `check-accessibility-permission`.
    - Added deep-linking to macOS System Settings -> Privacy & Security -> Accessibility.
- **Meeting Detection Notifications**:
    - Added native macOS system notifications when a meeting is detected.
    - Notification includes a "Start Recording" action button.
    - Added startup tip in Activity Logs to remind users to enable notifications.
    - **Supported Platforms**: Google Meet (Chrome, Safari), Zoom App. More platforms coming via SDK updates.

### Changed
- **Architecture**:
    - Decoupled authentication logic from the frontend; API keys are now securely stored in the local backend's SQLite database (`users.db`).
    - The Electron app now acts as a client to the local Python Relay server.
- **Permission Flow**: 
    - The app now requires Microphone, Screen Recording, AND Accessibility permissions to be granted before Onboarding/Session Start.
    - Improved permission polling logic to automatically detect system setting changes.
    - Updated `permissionUtil` to handle accessibility checks alongside media permissions.

### Removed
- Removed `VIDEODB_RELAY.md` (consolidated into internal documentation).
- Removed unused `docs/` directory.

## [1.0.0] - 2024-12-19
- Initial Release of VideoDB Relay Electron Sample.
