const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { exec, execSync } = require('child_process');
const ora = require('ora');
const { promisify } = require('util');
const execPromise = promisify(exec);

/**
 * Create a new Ampere project
 * @param {string} projectName - Name of the project to create
 * @param {Object} options - Command options
 */
async function createProject(projectName, options = {}) {
  // Enable debug mode with --debug flag
  const debug = options.debug || false;
  const skipDeps = options.skipDeps || false;
  
  // Log actions in debug mode
  const log = (message) => {
    if (debug) {
      console.log(chalk.cyan('[DEBUG] ') + message);
    }
  };

  const spinner = debug ? null : ora('Creating Ampere project...').start();
  log(`Starting project creation: ${projectName}`);
  
  try {
    const templatePath = path.resolve(__dirname, '../../template');
    const targetPath = path.resolve(process.cwd(), projectName);
    
    log(`Template path: ${templatePath}`);
    log(`Target path: ${targetPath}`);
    
    // Check if directory already exists
    if (fs.existsSync(targetPath)) {
      if (spinner) spinner.fail(chalk.red(`Directory ${projectName} already exists!`));
      else console.error(chalk.red(`Directory ${projectName} already exists!`));
      return;
    }
    
    // Create project directory
    fs.mkdirSync(targetPath);
    log('Created project directory');
    
    // Copy template files
    if (spinner) spinner.text = 'Copying template files...';
    log('Copying template files...');
    
    // Check if template directory exists for testing purposes
    if (!fs.existsSync(templatePath) && debug) {
      log('Template directory not found, creating dummy structure for testing');
      // Create basic structure for testing
      fs.mkdirSync(path.join(targetPath, 'frontend'), { recursive: true });
      fs.mkdirSync(path.join(targetPath, 'backend'), { recursive: true });
      fs.writeFileSync(path.join(targetPath, 'README.md'), '# ' + projectName + '\n\nCreated with Ampere CLI');
      fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify({
        name: projectName,
        "version": "0.0.1",
        "description": "An Electron/Vite + Python/FastAPI application",
        "main": "frontend/electron/main.js",
        "scripts": {
          "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
          "dev:frontend": "cd frontend && npm run dev",
          "dev:backend": "cd backend && uv run main.py",
          "install:all": "npm install && npm run setup:frontend && npm run setup:backend",
          "setup:frontend": "cd frontend && npm install",
          "setup:backend": "cd backend && uv venv && uv sync && uv pip install -r requirements.txt",
          "build": "cd frontend && npm run build",
          "start": "cross-env ELECTRON_START_URL=file://${PWD}/frontend/dist/index.html electron ."
        },
        "keywords": [
          "electron",
          "vite",
          "python",
          "fastapi",
          "ampere"
        ],
        "author": "",
        "license": "MIT",
        "devDependencies": {
          "concurrently": "^7.6.0",
          "cross-env": "^7.0.3",
          "electron": "^22.0.0"
        }
      }, null, 2));
    } else {
      await fs.copy(templatePath, targetPath);
      
      // Update project name in package.json files
      await updatePackageNames(targetPath, projectName);
    }
    
    // Initialize git repository
    if (spinner) spinner.text = 'Initializing git repository...';
    log('Initializing git repository...');
    
    try {
      await execPromise('git init', { cwd: targetPath });
      log('Git repository initialized');
      
      // Create .gitignore file if it doesn't exist
      if (!fs.existsSync(path.join(targetPath, '.gitignore'))) {
        const gitignoreContent = [
          'node_modules/',
          'dist/',
          'dist-electron/',
          '.env',
          '__pycache__/',
          '*.pyc',
          '.DS_Store',
          '.venv/',
          'npm-debug.log*',
          'yarn-debug.log*',
          'yarn-error.log*'
        ].join('\n');
        
        fs.writeFileSync(path.join(targetPath, '.gitignore'), gitignoreContent);
        log('Created .gitignore file');
      }
    } catch (error) {
      log(`Git initialization failed: ${error.message}`);
      console.log(chalk.yellow('\nWarning: Git initialization failed.'));
    }
    
    // Install dependencies
    if (!skipDeps) {
      if (spinner) spinner.text = 'Installing dependencies...';
      log('Installing project dependencies...');

      try {
        // Install root dependencies
        await installDependencies(targetPath, spinner, log);
        
        // Install frontend dependencies
        await installFrontendDependencies(targetPath, spinner, log);
        
        // Setup backend environment
        await setupBackendEnvironment(targetPath, spinner, log);
        
        log('All dependencies installed successfully');
      } catch (error) {
        log(`Dependency installation failed: ${error.message}`);
        console.log(chalk.yellow('\nWarning: Some dependencies may not have been installed correctly.'));
        console.log(chalk.yellow('You can install them manually after project creation.'));
      }
    } else {
      log('Skipping dependency installation as requested');
    }
    
    if (spinner) spinner.succeed(chalk.green(`Ampere project ${projectName} created successfully!`));
    else console.log(chalk.green(`Ampere project ${projectName} created successfully!`));
    
    // Show next steps
    console.log('\n' + chalk.bold('Next steps:'));
    console.log(`  cd ${projectName}`);
    
    if (skipDeps) {
      console.log('  npm run install:all');
    } else {
      console.log('  npm run dev');
    }
    
  } catch (error) {
    if (spinner) spinner.fail(chalk.red(`Failed to create project: ${error.message}`));
    else console.error(chalk.red(`Failed to create project: ${error.message}`));
    
    log(`Error details: ${error.stack}`);
    console.error(error);
  }
}

/**
 * Update package.json files with new project name
 * @param {string} targetPath - Target project path
 * @param {string} projectName - New project name
 */
async function updatePackageNames(targetPath, projectName) {
  const rootPackagePath = path.join(targetPath, 'package.json');
  const frontendPackagePath = path.join(targetPath, 'frontend', 'package.json');
  
  // Update root package.json
  if (fs.existsSync(rootPackagePath)) {
    const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    rootPackage.name = projectName;
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));
  }
  
  // Update frontend package.json
  if (fs.existsSync(frontendPackagePath)) {
    const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
    frontendPackage.name = `${projectName}-frontend`;
    fs.writeFileSync(frontendPackagePath, JSON.stringify(frontendPackage, null, 2));
  }
}

/**
 * Install root-level dependencies
 * @param {string} targetPath - Target project path
 * @param {Object} spinner - Ora spinner instance
 * @param {Function} log - Logging function
 */
async function installDependencies(targetPath, spinner, log) {
  if (spinner) spinner.text = 'Installing root dependencies...';
  log('Installing root dependencies...');
  
  try {
    await execPromise('npm install', { cwd: targetPath });
    log('Root dependencies installed');
    return true;
  } catch (error) {
    log(`Failed to install root dependencies: ${error.message}`);
    throw error;
  }
}

/**
 * Install frontend dependencies
 * @param {string} targetPath - Target project path
 * @param {Object} spinner - Ora spinner instance
 * @param {Function} log - Logging function
 */
async function installFrontendDependencies(targetPath, spinner, log) {
  const frontendPath = path.join(targetPath, 'frontend');
  
  if (fs.existsSync(frontendPath)) {
    if (spinner) spinner.text = 'Installing frontend dependencies...';
    log('Installing frontend dependencies...');
    
    try {
      await execPromise('npm install', { cwd: frontendPath });
      log('Frontend dependencies installed');
      return true;
    } catch (error) {
      log(`Failed to install frontend dependencies: ${error.message}`);
      throw error;
    }
  } else {
    log('Frontend directory not found, skipping dependency installation');
    return false;
  }
}

/**
 * Setup backend Python environment
 * @param {string} targetPath - Target project path
 * @param {Object} spinner - Ora spinner instance
 * @param {Function} log - Logging function
 */
async function setupBackendEnvironment(targetPath, spinner, log) {
  const backendPath = path.join(targetPath, 'backend');
  
  if (fs.existsSync(backendPath)) {
    if (spinner) spinner.text = 'Setting up Python backend...';
    log('Setting up Python backend environment...');
    
    try {
      // Check if uv is installed
      const hasUv = await checkUvInstalled();
      
      if (hasUv) {
        log('uv is installed, using it to set up Python environment');
        
        // Create virtual environment with uv
        await execPromise('uv venv', { cwd: backendPath });
        log('Created Python virtual environment with uv');
        
        // Create a pyproject.toml file if it doesn't exist
        const pyprojectPath = path.join(backendPath, 'pyproject.toml');
        if (!fs.existsSync(pyprojectPath)) {
          log('pyproject.toml not found, creating one');
          const pyprojectContent = `[project]
name = "${path.basename(targetPath)}-backend"
version = "0.0.1"
description = "Python FastAPI backend for ${path.basename(targetPath)}"
requires-python = ">=3.8"
dependencies = [
    "fastapi>=0.95.0",
    "uvicorn>=0.21.1",
    "pydantic>=1.10.7",
    "python-dotenv>=1.0.0",
    "psutil>=5.9.0"
]

[project.optional-dependencies]
dev = [
    "pytest>=7.3.1",
    "httpx>=0.24.0"
]

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[tool.setuptools.packages.find]
include = ["api*", "core*", "services*"]`;
          fs.writeFileSync(pyprojectPath, pyprojectContent);
          log('Created pyproject.toml file');
        }
        
        // Install requirements directly
        const reqFile = path.join(backendPath, 'requirements.txt');
        if (fs.existsSync(reqFile)) {
          await execPromise('uv pip install -r requirements.txt', { cwd: backendPath });
          log('Installed Python requirements with uv');
        } else {
          // If requirements.txt doesn't exist, create one with essential packages
          log('requirements.txt not found, creating one with essential packages');
          const requirementsContent = `fastapi>=0.95.0
uvicorn>=0.21.1
pydantic>=1.10.7,<2.0.0
python-dotenv>=1.0.0
psutil>=5.9.0`;
          fs.writeFileSync(reqFile, requirementsContent);
          
          // Install the created requirements
          await execPromise('uv pip install -r requirements.txt', { cwd: backendPath });
          log('Installed Python requirements with uv');
        }
        
        // Sync dependencies to ensure everything is updated
        await execPromise('uv sync', { cwd: backendPath });
        log('Synced Python dependencies with uv');
      } else {
        log('uv not found, adding setup instructions to README');
        
        // Add setup instructions to README
        const readmePath = path.join(targetPath, 'README.md');
        if (fs.existsSync(readmePath)) {
          const readmeContent = fs.readFileSync(readmePath, 'utf8');
          const uvInstructions = `
## Python Environment Setup

This project uses Python for the backend. You need to set up the Python environment:

1. Install [uv](https://github.com/astral-sh/uv) for Python environment management
2. Set up the environment:

\`\`\`bash
cd backend
uv venv  # Create virtual environment
uv pip install -r requirements.txt  # Install requirements
uv sync  # Sync dependencies
\`\`\`
`;
          fs.writeFileSync(readmePath, readmeContent + uvInstructions);
        }
      }
      
      return true;
    } catch (error) {
      log(`Failed to set up Python environment: ${error.message}`);
      log('You will need to set up the Python environment manually');
      return false;
    }
  } else {
    log('Backend directory not found, skipping Python environment setup');
    return false;
  }
}

/**
 * Check if uv is installed
 * @returns {Promise<boolean>} True if uv is installed
 */
async function checkUvInstalled() {
  try {
    await execPromise('uv --version');
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = createProject;
