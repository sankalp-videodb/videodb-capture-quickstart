# Changelog

All notable changes to this project will be documented in this file.
## [1.4.0] - 2026-01-12

### Added
- **Low-Latency Live Preview**: Integrated `rtsp-relay` and `jsmpeg` for ultra-low latency (<500ms) video streaming.
    - Replaced the placeholder/HLS player with a robust WebSocket-based solution.
    - Added `live-player.js` and `player.css` to manage streaming logic and styles.
    - Integrated logic into `renderer.js` to automatically start/stop streams based on recording events.
- **Split-View Live Session**: Redesigned the "Live Session" tab.
    - **Fixed Player**: Video player stays fixed at the top.
    - **Scrollable Transcriptions**: Transcriptions scroll independently below the player.
- **RTSP Relay Support**: Added backend support in `main.js` to proxy RTSP streams via WebSockets using `rtsp-relay`.
- **Recording Timestamps**: Added `created_at` column to Recording model for time-based grouping.
- **Recording Lifecycle Tracking**: Recordings now progress through states:
    - 🔴 **Recording**: Entry created when session starts.
    - ⏳ **Processing**: Updated when session stops, waiting for webhook.
    - ✅ **Available**: Set when webhook callback arrives with stream URL.
- **Auth Verification**: Added startup check to validate local token against backend; forces re-login if DB matches are missing.
- **Callback Config Sync**: Added `/api/settings/callback` endpoint to sync Localtunnel/Custom URLs with backend, fixing UI discrepancies.

### Changed
- **Timezone Handling**: Updated recording timestamps to use Local Time instead of UTC for correct "Today/Yesterday" grouping.
- **UI/UX Refinements**:
    - Renamed "Live Transcription" tab to "Live Session".
    - Updated tab styling to match Quickstart (icons, sliding indicator).
    - Removed redundant footer bar from the player section.
- **Simplified Notifications**:
    - Simplified the "Meeting Detected" notification flow to remove unnecessary data parsing.
    - Notification now shows a generic "Would you like to start recording?" message.
- **Scripts Cleanup**: Removed deprecated `reset-permissions.sh` script and `reset-permissions` npm command.
- **History UI Overhaul**:
    - Replaced back button with icon and zoom animation.
    - Implemented day-based grouping (Today, Yesterday, Date).
    - Updated list items to show recording time and duration.
    - Minimized layout with flatter design and sticky group headers.

### Fixed
- **Authentication Bug**: Added missing `register` IPC handler to fix "No handler for register" error when re-logging in.
- **Stream Logic**: Added `handleRecordingStarted` to correctly extract RTSP URLs and initiate playback.
- **Async Handling**: Updated `renderer.js` event listeners to properly handle async operations (awaiting stream start/stop).

### Fixed
- **History View Blank Screen**: Resolved a critical HTML nesting issue where the history view was hidden by the main app container.
- **Settings Modal Styling**: Aligned settings modal design with Quickstart (removed unused fields, improved button styling).
- **Sidebar & Profile UI**: Fixed missing hover animations for sidebar icons and profile picture (green border effect).

### Refactored
- **CSS Cleanup**: Extracted ~1500 lines of inline CSS from `index.html` into `main.css` for better maintainability.

## [1.3.6] - 2026-01-09

### Changed
- **Architectural Overhaul**: Migrated to a modular "Lifecycle Architecture" (Init -> Config -> Ready) for better stability and state management.
- **Frontend Restructuring**: Moved all frontend assets to `frontend/` directory for cleaner project structure.
- **Improved UI Modularization**: Refactored monolithic `renderer.js` into focused modules (`auth-modal.js`, `wizard.js`, `transcription.js`, `sidebar.js`, `history.js`).
- **Synchronous Event Handling**: Switched SDK event listeners to synchronous mode to fix high CPU usage and event lag.
- **Optimized Transcription**: Replaced legacy logging with a dedicated, optimized transcription view.

### Fixed
- **Startup Race Conditions**: Resolved issues where UI would load before permissions or config were ready.
- **Missing Assets**: Fixed 404 errors for tutorial images and player files.
- **Settings Modal Visibility**: Fixed bugs preventing the settings and history views from appearing.

## [1.3.5] - 2026-01-06

### Changed
- **Robust Tunnel Recovery**: Added auto-recovery for "tunnel already online" errors to prevent startup failures.
- **Flexible Port Config**: Backend now attempts to load `API_PORT` from `.env` file first before falling back to default or scanning.
- **Modern Config**: Migrated settings to Pydantic v2 `SettingsConfigDict`.

## [1.3.4] - 2026-01-06

### Changed
- **Unified Ngrok Status Check**: Synced ngrok auth flow across all apps. Uses `/api/tunnel/status` endpoint to check if ngrok is working instead of pyngrok config check.
- **Improved First-Run Experience**: Modal now correctly detects configured ngrok based on working webhook URL.

### Fixed
- **Ngrok Modal Not Dismissing**: Fixed issue where the ngrok modal would still appear even after successful configuration.

## [1.3.3] - 2026-01-06

### Fixed
- **Ngrok Auth Modal on First Run**: Fixed an issue where the Ngrok authentication modal would not appear on first-time startup when ngrok was not configured. The app now proactively checks tunnel status and displays the auth modal immediately instead of requiring users to click "Start Recording" first.

### Added
- **Tunnel Status API**: Added `/api/tunnel/status` endpoint to check ngrok auth status.
- **Proactive Auth Check**: App now checks and displays ngrok auth modal during initialization.

## [1.3.2] - 2026-01-03

### Added
- **Recording Timer**: Added a digital timer in the side panel that tracks session duration in real-time.

### Changed
- **System Logs UI**: Redesigned System Logs with a minimal, card-based layout for better readability.
- **UI Improvements**: Updated various UI elements for a cleaner, modern look (removed redundant icons, improved spacing).

### Fixed
- **Startup Stability**: Fixed a critical race condition in the startup script that caused the app to hang on launch.

## [1.3.1] - 2026-01-03

### Changed
- **Tunneling**: Replaced `localtunnel` with `ngrok` for public webhook URLs.
    - Implemented `TunnelManager` for robust per-session tunnel rotation.
    - Added a built-in modal for users to securely enter and save their Ngrok Authtoken.
    - Removed `localtunnel` dependency and usage.

## [1.3.0] - 2025-12-31

### Changed
- **Migration to VideoDB Recorder**:
    - Updated SDK from `@videodb/relay` to `@videodb/recorder` (v0.2.2).
    - Renamed application to **Meeting Copilot**.
    - Updated all internal API calls and IPC channels to use "Recorder" terminology.
    - Updated backend endpoints to `v1/recorder/*`.


## [1.2.3] - 2025-12-24

### Added
- **Rich Markdown Insights**:
    - Meeting reports are now generated in rich markdown format including:
        - 📋 **Meeting Summary**
        - 🎯 **Key Discussion Points**
        - 💡 **Key Decisions**
    - Insights panel now renders markdown with full styling (headers, lists, code blocks).
- **Startup Resilience**: Added robust polling mechanism to `start-server.sh` ensuring Electron only launches after the backend configuration (`runtime.json`) is fully updated.
- **Improved Logging**: Added console logging configuration for server modules (`routes.py`, `insights.py`) to ensure background task logs are visible.

### Changed
- **SDK Migration**: Migrated insight generation from direct HTTP API calls to the official `coll.generate_text()` SDK method.
- **History UX**: Insights panel now automatically loads for the most recent recording when opening the history view.

### Fixed
- **Race Condition**: Resolved a critical startup race condition where Electron would read stale configuration before the Python server had initialized.
- **Duplicate Listeners**: Fixed an issue where SDK event listeners were registered multiple times, causing duplicate transcript logs.

## [1.2.2] - 2025-12-23

### Changed
- **Zero-Config Tunneling**: Replaced `ngrok` with `localtunnel` for public URL generation.
    - No account signup or auth token required - just works out of the box.
    - Tunnel starts automatically via `npx localtunnel`.
- **Zero Python Setup**: Python 3.12 is now automatically installed via `uv` on first run.
    - Users no longer need to manually install Python.
    - `uv` handles Python version management, virtual environments, and package installation.
- **Simplified Configuration**: Streamlined `.env.example` to only essential options (`API_PORT`, `USE_TUNNEL`).
- **Improved Documentation**: Updated README with clearer setup instructions and troubleshooting.

### Fixed
- **Permissions Flow Before Onboarding**: Permissions check is now strictly blocking. The onboarding/login screen will not appear until all required permissions (Microphone, Screen Recording, Accessibility) are granted.
- **Duplicate Event Listeners**: Fixed lifecycle issue where SDK event listeners could be registered twice.

### Removed
- Removed `pyngrok` dependency from Python requirements.
- Removed `NGROK_AUTHTOKEN` environment variable (no longer needed).

## [1.2.1] - 2025-12-23

### Added
- **AI-Powered Meeting Insights**:
    - Added `generate_insights` function to automatically summarize meeting transcripts.
    - Uses VideoDB's text generation API to create 5-7 bullet point summaries.
    - Insights are generated after video indexing completes and displayed in the History view.
    - Gracefully skips insight generation when no transcript is available.

### Changed
- **Faster Dependency Installation**: Switched from `pip` to [`uv`](https://github.com/astral-sh/uv) for Python dependency management.
    - `uv` is auto-installed on first run if not present.
    - Provides 10-100x faster package installation and better dependency resolution.

## [1.2.0] - 2025-12-22

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

## [1.1.1] - 2025-12-22

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
