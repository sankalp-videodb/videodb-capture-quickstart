# Contributing to Async Recorder

Thank you for your interest in contributing to the Async Recorder app! We welcome contributions from the community.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/video-db/recorder-quickstart.git
    cd apps/electron-async-recorder
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```

## Development Workflow


- **Run the app**: `npm start`
    - This will automatically set up the Python environment in `server/venv` and start both the backend and frontend.
- **Backend Development**: The Python FastAPI backend is located in `server/`. Changes to python files will auto-reload the backend server.
- **Linting**: Ensure your code follows the existing style. We currently use standard ESLint configuration for Electron apps.

## Submitting Changes

1.  **Commit your changes** with clear, descriptive messages.
2.  **Push to your fork**:
    ```bash
    git push origin feature/amazing-feature
    ```
3.  **Open a Pull Request** (PR) against the `main` branch of the original repository.
4.  Describe your changes in the PR description, linking to any relevant issues.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/video-db/recorder-quickstart/issues). Provide as much detail as possible, including steps to reproduce the issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
