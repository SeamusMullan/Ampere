# Ampere

![Ampere Logo](assets/logo_128x128.png)

## ⚡ A supercharged Electron/Vite + Python/FastAPI application template ⚡

[![GitHub release](https://img.shields.io/github/v/release/SeamusMullan/ampere?include_prereleases&style=flat-square)](https://github.com/SeamusMullan/ampere/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/SeamusMullan/ampere/main.yml?branch=main&style=flat-square)](https://github.com/SeamusMullan/ampere/actions)
[![License](https://img.shields.io/github/license/SeamusMullan/ampere?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

## 🚀 Overview

Ampere is a modern desktop application template that combines Electron and Vite for frontend with Python and FastAPI for backend. This powerful combination provides a clean, versatile development environment for building high-performance, cross-platform desktop applications with a robust API layer.

## ✨ Features

- **Electron + Vite**: Lightning-fast frontend development with hot module replacement
- **Python + FastAPI**: High-performance, easy-to-use backend API framework
- **Interactive Setup**: Frontend scaffolding with customizable framework options
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Modern Python Tooling**: Uses `uv` for fast, reliable Python dependency management
- **Development Tools**: Built-in debugging, linting, and testing setup
- **Streamlined Workflow**: Integrated NPM scripts for managing both frontend and backend

## 🔧 Tech Stack

- **Frontend**:
  - Electron
  - Vite
  - TypeScript/JavaScript
  - React, Vue, Svelte, or Vanilla (selectable during setup)

- **Backend**:
  - Python 3.11+
  - FastAPI
  - Uvicorn
  - uv (Python package manager)

## 🏁 Getting Started

### Prerequisites

- Node.js 16+
- Python 3.11+
- npm
- uv (install with `pip install uv`)

### Quick Start with CLI

```bash
# Install ampere-cli globally
npm install -g ampere-cli

# Create a new project (interactive setup)
ampere create my-awesome-app

# Navigate to project
cd my-awesome-app

# Install all dependencies
npm run install:all

# Start development (runs both frontend and backend)
npm run dev
```

During project creation, you'll be prompted to select your preferred frontend framework and configuration options through the interactive electron-vite installer.

### Known issues

On some terminals, fastapi cannot render unicode characters when using concurrently. To fix this, please export the following in your terminal.

```text
export PYTHONIOENCODING=utf-8
```

### Project Scripts

After creating your project, you can use these npm scripts:

```bash
# Install all dependencies for both frontend and backend
npm run install:all

# Run both frontend and backend in development mode
npm run dev

# Run only the frontend in development mode
npm run dev:frontend

# Run only the backend
npm run dev:backend

# Build for production
npm run build

# Start the built application
npm run start
```

### Manual Installation

If you prefer to set up manually:

```bash
# Clone the repository
git clone https://github.com/SeamusMullan/ampere.git
cd ampere

# Setup frontend
cd frontend
npm install

# Setup backend
cd backend
uv venv
uv sync
uv pip install -r requirements.txt

# Start the development environment
# In one terminal (frontend):
cd frontend
npm run dev

# In another terminal (backend):
cd backend
uv run main.py
```

## 🧪 Testing Ampere CLI Locally

If you're developing the Ampere CLI tool, you can test it locally using:

```bash
# Navigate to the CLI directory
cd ampere-cli

# Install dependencies
npm install

# Create a global symlink
npm link

# Now you can use the CLI from anywhere
ampere create test-project

# To unlink when done
npm unlink ampere-cli
```

Alternatively, you can run the CLI directly without linking:

```bash
# Navigate to the CLI directory
cd ampere-cli

# Install dependencies
npm install

# Run CLI commands directly
node bin/ampere.js create test-project
```

## 💻 Development

### Project Structure

The generated project will have the following structure:

```text
<project_name>
├── package.json         # Root package.json with scripts for both frontend and backend
├── README.md
├── .gitignore
├── backend/
│   ├── api/             # FastAPI route definitions
│   │   ├── __init__.py
│   │   ├── data.py
│   │   └── status.py
│   ├── core/            # Core application logic
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── models.py
│   ├── services/        # Business logic services
│   │   ├── __init__.py
│   │   ├── data_service.py
│   │   └── status_service.py
│   ├── main.py          # FastAPI application entry point
│   ├── requirements.txt # Python dependencies
│   └── uv.lock          # Lock file for uv
└── frontend/
    ├── electron/        # Electron-specific code
    ├── src/             # Frontend source code
    ├── public/          # Static assets
    ├── package.json     # Frontend dependencies
    └── vite.config.js   # Vite configuration
```

## 🔄 How It Works

Ampere uses Electron as the application shell, embedding a Python FastAPI server that runs as a subprocess. The frontend communicates with the backend via HTTP requests, allowing for a clean separation of concerns while maintaining the performance benefits of local processing.

When you start the application in development mode:
1. The Electron/Vite frontend starts with hot module replacement enabled
2. The Python/FastAPI backend starts as a separate process
3. The frontend connects to the backend API endpoints
4. Changes to either codebase are automatically detected and reloaded

## 📦 Building for Production

To build your application for distribution:

```bash
npm run build
```

This creates a packaged Electron application in the `frontend/out` directory, ready for distribution.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
