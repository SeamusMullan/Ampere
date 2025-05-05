const { program } = require('commander');
const chalk = require('chalk');
const createCommand = require('./commands/create');

// Set up CLI version and description
program
  .version('0.0.1')
  .description('CLI tool for creating and managing Ampere applications');

// Register commands
program
  .command('create <project-name>')
  .description('Create a new Ampere project')
  .option('--debug', 'Enable debug mode')
  .option('--skip-deps', 'Skip installing dependencies')
  .action((projectName, options) => {
    createCommand(projectName, options);
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.log(`See --help for a list of available commands.`);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
