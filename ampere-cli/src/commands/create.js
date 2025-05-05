const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { exec, spawn } = require('child_process');
const ora = require('ora');
const { promisify } = require('util');
const execPromise = promisify(exec);

/**
 * Create a new Ampere project (Electron-Vite frontend + Python backend)
 * @param {string} projectName - Name of the project to create
 * @param {Object} options - Command options
 */
async function createProject(projectName, options = {}) {
  const debug = options.debug || false;
  const log = (msg) => debug && console.log(chalk.cyan('[DEBUG] ') + msg);
  const spinner = debug ? null : ora('Creating Ampere project...').start();

  try {
    const templatePath = path.resolve(__dirname, '../../template');
    const frontendTemplatePath = path.join(templatePath, 'frontend'); 
    const backendTemplatePath = path.join(templatePath, 'backend');
    const targetPath = path.resolve(process.cwd(), projectName);
    const backendTargetPath = path.join(targetPath, 'backend');
    const frontendTargetPath = path.join(targetPath, 'frontend');

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

    // 1. Scaffold frontend with electron-vite installer
    if (spinner) spinner.text = 'Scaffolding frontend with electron-vite...';
    log('Running electron-vite installer for frontend...');
    
    // Important: We need to use spawn rather than exec to properly handle interactive prompts
    if (spinner) spinner.stop();
    console.log(chalk.blue('\nSetting up frontend with electron-vite interactive installer...'));
    console.log(chalk.blue('Please select your preferred framework and options when prompted.\n'));
    
    let frontendSetupSuccess = false;
    
    try {
      // First create frontend directory to ensure correct placement
      fs.mkdirSync(frontendTargetPath, { recursive: true });
      
      // Use spawn with stdio: 'inherit' to properly handle the interactive installer
      // Critical fix: Use npm create instead of npx create
      await new Promise((resolve, reject) => {
        const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        const electronVite = spawn(npm, ['create', '@quick-start/electron@latest', '.'], {
          cwd: frontendTargetPath,
          stdio: 'inherit',
          shell: true
        });

        electronVite.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Electron-vite installer exited with code ${code}`));
          }
        });
      });
      
      // Verify frontend was created properly
      if (!fs.existsSync(path.join(frontendTargetPath, 'package.json'))) {
        throw new Error('Frontend package.json not found after installation');
      }
      
      frontendSetupSuccess = true;
      log('Frontend scaffolded successfully');
      if (spinner) spinner.start();
    } catch (err) {
      console.error(chalk.red('Electron-Vite scaffolding failed: ', err.message));
      
      // Fallback: if the template/frontend directory exists, copy it instead
      if (fs.existsSync(frontendTemplatePath)) {
        console.log(chalk.yellow('\nFalling back to copy the existing frontend template...'));
        try {
          // Remove the potentially partially created frontend directory
          fs.removeSync(frontendTargetPath);
          
          // Copy the template frontend
          await fs.copy(frontendTemplatePath, frontendTargetPath);
          console.log(chalk.green('Frontend template copied successfully.'));
          frontendSetupSuccess = true;
          
          // Update package.json in the frontend with correct name
          const frontendPackagePath = path.join(frontendTargetPath, 'package.json');
          if (fs.existsSync(frontendPackagePath)) {
            const frontendPkg = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
            frontendPkg.name = `${projectName}-frontend`;
            fs.writeFileSync(frontendPackagePath, JSON.stringify(frontendPkg, null, 2));
          }
        } catch (copyErr) {
          console.error(chalk.red('Frontend template copying failed: ', copyErr.message));
        }
      }
      
      if (!frontendSetupSuccess) {
        console.error(chalk.red('Frontend setup failed. Please set up the frontend manually.'));
        // Don't throw here - let's continue creating the project without frontend
      }
      
      if (spinner) spinner.start();
    }

    // 2. Copy backend template
    if (spinner) spinner.text = 'Copying backend template...';
    log('Copying backend template...');
    await fs.copy(backendTemplatePath, backendTargetPath);
    log('Backend template copied');

    // 3. Create root package.json and README.md
    if (spinner) spinner.text = 'Creating root package.json and README...';
    log('Copying template package.json...');
    
    // Read the template package.json
    const templatePkgPath = path.join(templatePath, 'package.json');
    if (!fs.existsSync(templatePkgPath)) {
      throw new Error('Template package.json not found!');
    }
    
    // Load and modify the template package.json
    const rootPkg = JSON.parse(fs.readFileSync(templatePkgPath, 'utf8'));
    rootPkg.name = projectName; // Update project name
    
    // Write the modified package.json to the target directory
    fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(rootPkg, null, 2));
    log('Root package.json created');
    
    // Copy README.md template if exists
    const readmeSrc = path.join(templatePath, 'README.md');
    if (fs.existsSync(readmeSrc)) {
      await fs.copy(readmeSrc, path.join(targetPath, 'README.md'));
    } else {
      fs.writeFileSync(path.join(targetPath, 'README.md'), `# ${projectName}\n\nCreated with Ampere CLI.`);
    }

    // 4. Initialize git repository
    if (spinner) spinner.text = 'Initializing git repository...';
    log('Initializing git repository...');
    try {
      await execPromise('git init', { cwd: targetPath });
      log('Git repository initialized');
      // Create .gitignore if not exists
      const gitignorePath = path.join(targetPath, '.gitignore');
      if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, [
          'node_modules/',
          'dist/',
          'dist-electron/',
          'out/',
          '.env',
          '__pycache__/',
          '*.pyc',
          '.DS_Store',
          '.venv/',
          'npm-debug.log*',
          'yarn-debug.log*',
          'yarn-error.log*'
        ].join('\n'));
        log('Created .gitignore file');
      }
    } catch (error) {
      log(`Git initialization failed: ${error.message}`);
      console.log(chalk.yellow('\nWarning: Git initialization failed.'));
    }

    // 5. Set up backend Python environment
    if (spinner) spinner.text = 'Setting up Python backend...';
    log('Setting up Python backend...');
    try {
      await execPromise('uv venv', { cwd: backendTargetPath });
      await execPromise('uv pip install -r requirements.txt', { cwd: backendTargetPath });
      await execPromise('uv sync', { cwd: backendTargetPath });
      log('Python backend set up with uv');
    } catch (err) {
      log('Python backend setup failed or uv not installed.');
      console.log(chalk.yellow('Warning: Python backend setup failed or uv not installed. Please set up manually.'));
    }

    if (spinner) spinner.succeed(chalk.green(`Ampere project ${projectName} created successfully!`));
    else console.log(chalk.green(`Ampere project ${projectName} created successfully!`));

    // 6. Show next steps
    console.log('\n' + chalk.bold('Next steps:'));
    console.log(`  cd ${projectName}`);
    
    if (frontendSetupSuccess) {
      console.log('  # Install all dependencies:');
      console.log('  npm run install:all');
      console.log('\n  # Start frontend:');
      console.log('  cd frontend && npm run dev');
      console.log('  # Start backend:');
      console.log('  cd ../backend && uv run main.py');
      console.log('\n  # Or run both at once:');
      console.log('  npm run dev');
    } else {
      console.log('  # Set up frontend manually, then:');
      console.log('  npm run install:all');
      console.log('\n  # Start backend:');
      console.log('  cd backend && uv run main.py');
    }
    
    console.log('\nHappy hacking!');
  } catch (error) {
    if (spinner) spinner.fail(chalk.red(`Failed to create project: ${error.message}`));
    else console.error(chalk.red(`Failed to create project: ${error.message}`));
    log(`Error details: ${error.stack}`);
    process.exit(1);
  }
}

module.exports = createProject;
