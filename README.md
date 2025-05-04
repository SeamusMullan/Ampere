# Ampere

![Ampere Logo](assets/logo_128x128.png)

## ⚡ A supercharged Electron/Vite + Python/FastAPI application template ⚡

[![GitHub release](https://img.shields.io/github/v/release/SeamusMullan/ampere?include_prereleases&style=flat-square)](https://github.com/SeamusMullan/ampere/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/SeamusMullan/ampere/main.yml?branch=main&style=flat-square)](https://github.com/SeamusMullan/ampere/actions)
[![License](https://img.shields.io/github/license/SeamusMullan/ampere?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

</div>

## 🚀 Overview

Ampere is a modern desktop application template that combines Electron and Vite for frontend with Python and FastAPI for backend. This is a clean, versatile development environment, great for building high-performance, functional and cross platform desktop applications with a robust API layer.

## ✨ Features

- **Electron + Vite**: Lightning-fast frontend development with hot module replacement
- **Python + FastAPI**: High-performance, easy-to-use backend API framework
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Development Tools**: Built-in debugging, linting, and testing setup
- **Easy Setup**: Contains tasks for VSCode to setup with `npm` and `uv`

## 🔧 Tech Stack

- **Frontend**:
  - Electron
  - Vite
  - TypeScript/JavaScript
  - React (optional)

- **Backend**:
  - Python 3.11+
  - FastAPI
  - Uvicorn

## 🏁 Getting Started

### Prerequisites

- Node.js 16+
- Python 3.11+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SeamusMullan/ampere.git
cd ampere

# Setup frontend
cd frontend
npm install

# Setup backend
cd backend
uv sync
uv pip install -r requirements.txt

# Start the development environment

# run frontend
npm run dev

# run backend
uv run main.py

```

## 💻 Development

### Project Structure

```text
ampere/
├── electron/             # Electron main process code
├── src/                  # Frontend application code
├── python/               # Python backend code
│   ├── api/              # FastAPI routes
│   ├── models/           # Data models
│   └── services/         # Business logic
├── scripts/              # Build and development scripts
├── tests/                # Test suites
└── resources/            # Static resources
```

## 📦 Building for Production

```bash
# Build for current platform
yarn build

# Build for specific platforms
yarn build:win
yarn build:mac
yarn build:linux
```

## 🔄 How It Works

Ampere uses Electron as the application shell and embeds a Python FastAPI server that runs as a subprocess. The frontend communicates with the backend via HTTP requests, allowing for a clean separation of concerns while maintaining the performance benefits of local processing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ⚡ by <a href="https://github.com/SeamusMullan">Your Name</a></sub>
</div>
