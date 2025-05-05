# Ampere CLI

A command-line interface for creating and managing Ampere applications.

## Installation

```bash
# Install globally
npm install -g ampere-cli

# Or use npx
npx ampere-cli
```

## Usage

```bash
# Create a new project
ampere create my-awesome-app

# Show help
ampere --help
```

## Local Development

### Testing Locally

You can test the CLI locally without publishing using the following methods:

#### Method 1: npm link (Recommended)

This creates a symlink to use your local version globally:

```bash
# From the ampere-cli directory
npm install
npm link

# Now you can use the CLI from anywhere
ampere create test-project

# When you're done testing
npm unlink ampere-cli
```

#### Method 2: Direct execution

Run the CLI directly without linking:

```bash
# From the ampere-cli directory
npm install

# Run commands directly
node bin/ampere.js create test-project
# OR
npm run dev create test-project
```

#### Method 3: Using Debug Mode

For development, use the debug flag to see more information:

```bash
ampere create test-project --debug
```

### Working with Templates

The `template` directory contains the files and structure that will be copied when creating a new project. To customize the template:

1. Navigate to `ampere-cli/template/`
2. Modify the files as needed
3. Test your changes by creating a new project

You can also develop custom templates:

```bash
# Copy the default template to a new directory
cp -r template my-custom-template

# Make your modifications in the new directory

# Use your custom template (requires code modification in src/commands/create.js)
```

## Project Structure

```text
ampere-cli/
├── bin/               # CLI entry point
├── src/
│   ├── commands/      # Command implementations
│   └── index.js       # Main CLI logic
├── template/          # Project template files
│   ├── frontend/      # Electron/Vite template
│   ├── backend/       # Python/FastAPI template
│   └── README.md      # Template README
└── package.json
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
