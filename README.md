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

### Quick Start with CLI

```bash
# Install ampere-cli globally
npm install -g ampere-cli

# Create a new project
ampere create my-awesome-app

# Navigate to project
cd my-awesome-app

# Start development
npm run dev
```

### Manual Installation

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

```text
<project_name>
├── backend
│   ├── __pycache__
│   ├── api
│   ├── core
│   └── services
└── frontend
    ├── dist-electron
    ├── electron
    ├── node_modules
    ├── public
    └── src
```

## 📦 Building for Production

- TODO

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
