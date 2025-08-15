# Development Guide

## Setup

```bash
git clone https://github.com/abaljeu/vscode-markdown-notes.git
cd vscode-markdown-notes
npm install
```

## Build & Install

### Quick Development

1. Open in VS Code: `code .`
2. Press `F5` to launch Extension Development Host
3. Make changes, press `Ctrl+R` in the dev window to reload

### Build Package

```bash
npm run compile     # Build
npm run vpackage    # Create .vsix file
```

Install the `.vsix` file via Extensions view → "Install from VSIX..."

### Watch Mode

```bash
npm run watch       # Auto-compile on changes
```

## Testing

```bash
npm test            # Run tests
npm run lint        # Check code quality
```

## Common Commands

- `npm run compile` - Build the extension
- `npm run watch` - Auto-build on file changes  
- `npm run vpackage` - Create installable .vsix
- `F5` in VS Code - Launch development instance
